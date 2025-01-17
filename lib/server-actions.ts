import "server-only";
import {
  InternalServerError,
  PublicError,
  UnauthenticatedUserError,
} from "@/lib/errors";
import { ZodError } from "zod";
import { validateRequest } from "@/lib/auth";
import { createServerActionProcedure, ZSAError } from "zsa";
import * as Sentry from "@sentry/nextjs";

export async function shapeErrors({ err: error }: any) {
  if (error instanceof ZodError) return { error: error.message };
  if (error instanceof ZSAError) return { error: error.message };
  if (error instanceof PublicError) return { error: error.message };
  if (error instanceof InternalServerError)
    console.log("Internal server error", error.message);
  else console.log("Unknown error on server action", error);

  Sentry.captureException(error);

  return { error: "Ocurrió un inconveniente, intente mas tarde" };
}

export const authenticatedAction = createServerActionProcedure()
  .experimental_shapeError(shapeErrors)
  .handler(async () => {
    const { user } = await validateRequest();
    if (!user) throw new UnauthenticatedUserError();
    return { user };
  });

export const unauthenticatedAction = createServerActionProcedure()
  .experimental_shapeError(shapeErrors)
  .handler(() => {});
