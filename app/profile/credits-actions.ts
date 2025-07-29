"use server";

import { authenticatedAction } from "@/lib/server-actions";
import { 
  getUserCreditsService, 
  getCreditHistoryService, 
  getAvailableCreditPackages,
  createPaymentIntentService 
} from "@/services/credits";
import { z } from "zod";

export const getUserCreditsAction = authenticatedAction
  .action(async ({ ctx: { user } }) => {
    return await getUserCreditsService(user.id);
  });

export const getCreditHistoryAction = authenticatedAction
  .action(async ({ ctx: { user } }) => {
    return await getCreditHistoryService(user.id);
  });

export const getCreditPackagesAction = authenticatedAction
  .action(async () => {
    return await getAvailableCreditPackages();
  });

export const createPaymentIntentAction = authenticatedAction
  .inputSchema(z.object({ packageId: z.number() }))
  .action(async ({ parsedInput: { packageId }, ctx: { user } }) => {
    return await createPaymentIntentService(user.id, packageId);
  });