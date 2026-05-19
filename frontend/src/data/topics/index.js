// Aggregated topic content — imports all weeks and merges into single lookup
import WEEK1_TOPICS from './week1';
import WEEK2_TOPICS from './week2';
import WEEK3_TOPICS from './week3';
import WEEK4_TOPICS from './week4';
import WEEK5_TOPICS from './week5';
import WEEK6_TOPICS from './week6';
import WEEK7_TOPICS from './week7';

const TOPICS = {
  ...WEEK1_TOPICS,
  ...WEEK2_TOPICS,
  ...WEEK3_TOPICS,
  ...WEEK4_TOPICS,
  ...WEEK5_TOPICS,
  ...WEEK6_TOPICS,
  ...WEEK7_TOPICS,
};

export default TOPICS;
