/** @type {import('next').NextConfig} */
const POSTBC = require('./components/blockchain/POSTBC');
const cron = require('node-cron');
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

// cron.schedule('* * * * *', async function() {
cron.schedule('*/30 * * * * *', async function() {
  let post = await new POSTBC().postData();
  console.log(post);
});

module.exports = nextConfig;