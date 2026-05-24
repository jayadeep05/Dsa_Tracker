$PEM    = "$PSScriptRoot\backend.pem"
$EC2    = "ubuntu@ec2-13-48-212-110.eu-north-1.compute.amazonaws.com"
$REMOTE = "/home/ubuntu/dsatracker"
$ZIP    = "$PSScriptRoot\deploy_bundle.zip"

# ── 1. Build frontend locally ────────────────────────────────────────────────
Write-Host "=== [1/5] Building frontend ===" -ForegroundColor Yellow
Push-Location "$PSScriptRoot\frontend"
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "FAILED: frontend build" -ForegroundColor Red; Pop-Location; exit 1 }
Pop-Location
Write-Host "OK: frontend built" -ForegroundColor Green

# ── 2. Create zip (exclude node_modules, target, .git) ──────────────────────
Write-Host "=== [2/5] Creating deploy zip ===" -ForegroundColor Yellow
if (Test-Path $ZIP) { Remove-Item $ZIP }

# Use 7z if available, otherwise PowerShell Compress-Archive with exclusions
$has7z = Get-Command "7z" -ErrorAction SilentlyContinue
if ($has7z) {
    & 7z a -tzip $ZIP "$PSScriptRoot\backend\*"  -xr!"target" -xr!".mvn" | Out-Null
    & 7z a -tzip $ZIP "$PSScriptRoot\frontend\*" -xr!"node_modules" | Out-Null
    & 7z a -tzip $ZIP "$PSScriptRoot\docker-compose.yml" | Out-Null
    & 7z a -tzip $ZIP "$PSScriptRoot\.env" | Out-Null
    Write-Host "OK: zip created via 7z" -ForegroundColor Green
} else {
    # Fallback: use robocopy to create a clean staging dir in system TEMP, then zip
    $STAGE = "$env:TEMP\_deploy_stage"
    if (Test-Path $STAGE) { Remove-Item -Recurse -Force $STAGE }
    New-Item -ItemType Directory -Path $STAGE | Out-Null

    # Copy backend (exclude target/)
    robocopy "$PSScriptRoot\backend"  "$STAGE\backend"  /E /XD target .mvn /XF "*.log" /NP /NFL /NDL | Out-Null
    # Copy frontend (exclude node_modules/)
    robocopy "$PSScriptRoot\frontend" "$STAGE\frontend" /E /XD node_modules /NP /NFL /NDL | Out-Null
    # Copy root config files
    Copy-Item "$PSScriptRoot\docker-compose.yml" "$STAGE\"
    Copy-Item "$PSScriptRoot\.env"               "$STAGE\"

    Compress-Archive -Path "$STAGE\*" -DestinationPath $ZIP -Force
    Remove-Item -Recurse -Force $STAGE
    Write-Host "OK: zip created via Compress-Archive" -ForegroundColor Green
}

$zipSize = [math]::Round((Get-Item $ZIP).Length / 1MB, 1)
Write-Host "   Zip size: ${zipSize} MB" -ForegroundColor DarkGray

# ── 3. SCP the zip ──────────────────────────────────────────────────────────
Write-Host "=== [3/5] Uploading zip to EC2 ===" -ForegroundColor Yellow
ssh -i $PEM -o StrictHostKeyChecking=no $EC2 "mkdir -p $REMOTE"
scp -i $PEM -o StrictHostKeyChecking=no $ZIP "${EC2}:/home/ubuntu/deploy_bundle.zip"
if ($LASTEXITCODE -ne 0) { Write-Host "FAILED: scp" -ForegroundColor Red; exit 1 }
Write-Host "OK: uploaded" -ForegroundColor Green

# ── 4. Unzip + stop old containers ──────────────────────────────────────────
Write-Host "=== [4/5] Extracting on EC2 and stopping containers ===" -ForegroundColor Yellow
ssh -i $PEM -o StrictHostKeyChecking=no $EC2 "if [ -d $REMOTE ] && [ -f $REMOTE/docker-compose.yml ]; then cd $REMOTE && docker compose down --remove-orphans; fi ; cd /home/ubuntu && sudo rm -rf $REMOTE && mkdir -p $REMOTE && (unzip -o deploy_bundle.zip -d $REMOTE || true) && rm -f deploy_bundle.zip && sudo chmod -R 775 $REMOTE"
if ($LASTEXITCODE -ne 0) { Write-Host "FAILED: extract/stop" -ForegroundColor Red; exit 1 }

# ── 5. Rebuild images + start ────────────────────────────────────────────────
Write-Host "=== [5/5] Building Docker images and starting ===" -ForegroundColor Yellow
ssh -i $PEM -o StrictHostKeyChecking=no $EC2 "cd $REMOTE && docker compose build --no-cache backend frontend && docker compose up -d && docker compose ps"
if ($LASTEXITCODE -ne 0) { Write-Host "FAILED: docker build/up" -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "=== DEPLOYMENT COMPLETE ===" -ForegroundColor Cyan
Write-Host "Frontend : http://ec2-13-48-212-110.eu-north-1.compute.amazonaws.com:8082" -ForegroundColor Cyan
Write-Host "Backend  : http://ec2-13-48-212-110.eu-north-1.compute.amazonaws.com:8080" -ForegroundColor Cyan
