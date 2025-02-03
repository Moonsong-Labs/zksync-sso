import config from "./config";
import { GoogleFetcher } from "./fetchers/google";

const main = async () => {
  const fetcher = new GoogleFetcher();

  try {
    const keys = await fetcher.fetchKeys();
    console.log("Fetched keys:", keys);
  } catch (error) {
    console.error("Error fetching keys:", error);
  }

  setTimeout(main, config.FETCH_INTERVAL);
};

main();