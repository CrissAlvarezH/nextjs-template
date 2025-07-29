import "server-only";
import { 
  getUserCredits, 
  addCreditsToUser, 
  deductCreditsFromUser, 
  createCreditTransaction,
  getCreditTransactions,
  getActiveCreditPackages,
  getCreditPackageById,
  getCreditTransactionByPaymentId
} from "@/repositories/credits";
import { wompi } from "@/lib/wompi";
import { SelectCreditPackage } from "@/db/schemas/credits";
import { InternalServerError } from "@/lib/errors";

export async function getUserCreditsService(userId: number): Promise<number> {
  return await getUserCredits(userId);
}

export async function getCreditHistoryService(userId: number) {
  return await getCreditTransactions(userId);
}

export async function getAvailableCreditPackages(): Promise<SelectCreditPackage[]> {
  return await getActiveCreditPackages();
}

export async function createPaymentIntentService(
  userId: number, 
  packageId: number
): Promise<{ transactionId: string; amount: number }> {
  const creditPackage = await getCreditPackageById(packageId);
  if (!creditPackage) {
    throw new InternalServerError("Credit package not found");
  }

  // For Wompi, we create a transaction reference instead of payment intent
  // The actual payment will be handled on the frontend with Wompi's widget
  const reference = `${userId}:${packageId}:${Date.now()}`;

  return {
    transactionId: reference,
    amount: creditPackage.priceCents,
  };
}

export async function processPurchaseService(
  userId: number,
  wompiTransactionId: string,
  packageId: number
): Promise<void> {
  // Check if transaction already exists
  const existingTransaction = await getCreditTransactionByPaymentId(wompiTransactionId);
  if (existingTransaction) {
    return; // Already processed
  }

  const creditPackage = await getCreditPackageById(packageId);
  if (!creditPackage) {
    throw new InternalServerError("Credit package not found");
  }

  // Add credits to user
  await addCreditsToUser(userId, creditPackage.credits);

  // Create transaction record
  await createCreditTransaction({
    userId,
    amount: creditPackage.credits,
    type: "purchase",
    description: `Purchased ${creditPackage.name}`,
    stripePaymentIntentId: wompiTransactionId,
    packageId,
  });
}

export async function useCreditsService(
  userId: number, 
  amount: number, 
  description: string
): Promise<boolean> {
  const success = await deductCreditsFromUser(userId, amount);
  
  if (success) {
    await createCreditTransaction({
      userId,
      amount: -amount,
      type: "usage",
      description,
    });
  }
  
  return success;
}

export async function hasEnoughCreditsService(
  userId: number, 
  requiredAmount: number
): Promise<boolean> {
  const currentCredits = await getUserCredits(userId);
  return currentCredits >= requiredAmount;
}