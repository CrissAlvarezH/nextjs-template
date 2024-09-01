// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { env } from "@/env";

Sentry.init({
  dsn: "https://5a29f62302a307b2dce58f8105e70d8d@o4506157017989120.ingest.us.sentry.io/4507879473152000",

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  environment: env.ENVIRONMENT,
});
