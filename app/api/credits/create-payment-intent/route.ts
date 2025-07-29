import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { createPaymentIntentService } from "@/services/credits";
import { z } from "zod";

const createPaymentIntentSchema = z.object({
  packageId: z.number().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { packageId } = createPaymentIntentSchema.parse(body);

    const { transactionId, amount } = await createPaymentIntentService(user.id, packageId);

    return NextResponse.json({ 
      transactionId,
      amount,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}