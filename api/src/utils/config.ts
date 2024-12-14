import dotenv from 'dotenv';

dotenv.config();

export default {
  NODE_ENV: process.env.NODE_ENV,
  PORT: 4000,
  DEV_WEB_URL: 'http://localhost:3000',
  PROD_WEB_URL: 'https://task.yshplsngh.in',
};
