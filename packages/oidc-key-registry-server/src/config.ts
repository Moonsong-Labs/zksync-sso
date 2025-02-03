import "dotenv/config";

export default {
  FETCH_INTERVAL: parseInt(process.env.FETCH_INTERVAL || "60000"),
  ZKSYNC_PRIVATE_KEY: process.env.ZKSYNC_PRIVATE_KEY!,
};
