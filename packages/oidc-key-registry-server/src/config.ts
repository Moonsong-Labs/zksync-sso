import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const config = createEnv({
  server: {
    FETCH_INTERVAL: z.preprocess(
      (val) => Number(val),
      z.number().default(60 * 1000)
    ),
    ZKSYNC_PRIVATE_KEY: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
