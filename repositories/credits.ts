import "server-only";
import { db } from "@/db";
import { users, creditTransactions, creditPackages } from "@/db/schemas";
import { eq, desc, and, sql } from "drizzle-orm";
import { 
  InsertCreditTransaction, 
  SelectCreditTransaction,
  InsertCreditPackage,
  SelectCreditPackage 
} from "@/db/schemas/credits";

export async function getUserCredits(userId: number): Promise<number> {
  const [user] = await db
    .select({ credits: users.credits })
    .from(users)
    .where(eq(users.id, userId));
  
  return user?.credits ?? 0;
}

export async function updateUserCredits(userId: number, credits: number): Promise<void> {
  await db
    .update(users)
    .set({ credits })
    .where(eq(users.id, userId));
}

export async function addCreditsToUser(userId: number, amount: number): Promise<void> {
  await db.execute(sql`
    UPDATE users 
    SET credits = credits + ${amount} 
    WHERE id = ${userId}
  `);
}

export async function deductCreditsFromUser(userId: number, amount: number): Promise<boolean> {
  const result = await db.execute(sql`
    UPDATE users 
    SET credits = credits - ${amount} 
    WHERE id = ${userId} AND credits >= ${amount}
  `);
  
  return (result as any).rowCount > 0;
}

export async function createCreditTransaction(transaction: InsertCreditTransaction): Promise<SelectCreditTransaction> {
  const [created] = await db
    .insert(creditTransactions)
    .values(transaction)
    .returning();
  
  return created;
}

export async function getCreditTransactions(userId: number, limit: number = 50): Promise<SelectCreditTransaction[]> {
  return await db
    .select()
    .from(creditTransactions)
    .where(eq(creditTransactions.userId, userId))
    .orderBy(desc(creditTransactions.createdAt))
    .limit(limit);
}

export async function getCreditTransactionByPaymentId(paymentId: string): Promise<SelectCreditTransaction | null> {
  const [transaction] = await db
    .select()
    .from(creditTransactions)
    .where(eq(creditTransactions.stripePaymentIntentId, paymentId));
  
  return transaction ?? null;
}

export async function getActiveCreditPackages(): Promise<SelectCreditPackage[]> {
  return await db
    .select()
    .from(creditPackages)
    .where(eq(creditPackages.isActive, true))
    .orderBy(creditPackages.credits);
}

export async function getCreditPackageById(id: number): Promise<SelectCreditPackage | null> {
  const [pkg] = await db
    .select()
    .from(creditPackages)
    .where(eq(creditPackages.id, id));
  
  return pkg ?? null;
}

export async function createCreditPackage(pkg: InsertCreditPackage): Promise<SelectCreditPackage> {
  const [created] = await db
    .insert(creditPackages)
    .values(pkg)
    .returning();
  
  return created;
}