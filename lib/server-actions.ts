import {
  InternalServerError,
  PublicError,
  UnauthenticatedUserError,
} from "@/lib/errors";
import { ZodError } from "zod";
import { validateRequest } from "@/lib/auth";
import { createServerActionProcedure } from "zsa";

export async function shapeErrors({ err: error }: any) {
  if (error instanceof ZodError) return { error: error.message };
  if (error instanceof PublicError) return { error: error.message };
  if (error instanceof InternalServerError)
    console.log("Internal server error", error.message);
  else console.log("Unknown error on server action", error);

  // TODO send to Sentry

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
