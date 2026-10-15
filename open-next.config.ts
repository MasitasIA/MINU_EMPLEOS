import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import type { OpenNextConfig } from "@opennextjs/aws/types/open-next.js";

const config: OpenNextConfig = {
  ...defineCloudflareConfig(),
  buildCommand: "npx next build",
};

export default config;
