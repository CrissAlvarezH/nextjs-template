// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { env } from "@/env";

Sentry.init({
  dsn: "https://5a29f62302a307b2dce58f8105e70d8d@o4506157017989120.ingest.us.sentry.io/4507879473152000",

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  environment: env.NEXT_PUBLIC_ENVIRONMENT,
});
