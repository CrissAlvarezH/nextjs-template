import "server-only";
import {
  InternalServerError,
  PublicError,
  UnauthenticatedUserError,
} from "@/lib/errors";
import { ZodError } from "zod";
import { validateRequest } from "@/lib/auth";
import * as Sentry from "@sentry/nextjs";

import { createSafeActionClient } from "next-safe-action";

const actionClient = createSafeActionClient({
  handleServerError(e, utils) {
    const { clientInput, bindArgsClientInputs, metadata, ctx } = utils;
    console.error(
      "clientInput", clientInput,
      "bindArgsClientInputs", bindArgsClientInputs,
      "metadata", metadata,
      "ctx", ctx,
      "error", e
    );
    return shapeErrors({ err: e });
  },
});

export const authenticatedAction = actionClient.use(async ({ next }) => {
  const { user } = await validateRequest();
  if (!user) throw new UnauthenticatedUserError();
  return next({ ctx: { user } });
});

export const unauthenticatedAction = actionClient.use(async ({ next }) => {
  return next({ ctx: { user: null } });
});


function shapeErrors({ err: error }: any): string {
  if (error instanceof ZodError) return error.message;
  if (error instanceof PublicError) return error.message;
  if (error instanceof InternalServerError)
    console.log("Internal server error", error.message);
  else console.log("Unknown error on server action", error);

  Sentry.captureException(error);

  return "Ocurrió un inconveniente, intente mas tarde";
}
