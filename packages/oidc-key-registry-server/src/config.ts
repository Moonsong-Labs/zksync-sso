import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const config = createEnv({
  server: {
    FETCH_INTERVAL: z.preprocess(
      (val) => (val === undefined ? 60 * 1000 : Number(val)),
      z.number()
    ),
    ZKSYNC_PRIVATE_KEY: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
