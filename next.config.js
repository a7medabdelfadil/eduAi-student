/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
  },
  transpilePackages: ["geist"],

  images: {
    domains: ['eduai.vitaparapharma.com'],
  },
};

export default config;
