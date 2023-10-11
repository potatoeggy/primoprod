import type { Banner } from "@/types";

const context = require.context("@/custom/banners/", false, /\.json$/);
export const banners: Record<string, Banner> = {};

for (const key of context.keys()) {
  const banner = context(key);
  banners[banner.id] = banner;
}
