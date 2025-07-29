import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { env } from "@/env";
import { processPurchaseService } from "@/services/credits";
import crypto from "crypto";

interface WompiWebhookEvent {
  event: string;
  data: {
    transaction: {
      id: string;
      amount_in_cents: number;
      reference: string;
      customer_email: string;
      currency: string;
      payment_method_type: string;
      redirect_url: string;
      status: string;
      shipping_address: any;
      payment_link_id: number;
      payment_source_id?: number;
    };
  };
  sent_at: string;
  timestamp: number;
  signature: {
    properties: string[];
    checksum: string;
  };
  environment: string;
}

function verifyWompiSignature(
  payload: string,
  signature: string,
  timestamp: number,
  secret: string
): boolean {
  const properties = `${payload}${timestamp}${secret}`;
  const expectedSignature = crypto
    .createHash("sha256")
    .update(properties)
    .digest("hex");
  
  return expectedSignature === signature;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("x-signature");
  const timestamp = headersList.get("x-timestamp");

  if (!signature || !timestamp) {
    return NextResponse.json(
      { error: "Missing signature or timestamp headers" },
      { status: 400 }
    );
  }

  let event: WompiWebhookEvent;

  try {
    event = JSON.parse(body);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  // Verify webhook signature
  const isValidSignature = verifyWompiSignature(
    body,
    signature,
    parseInt(timestamp),
    env.WOMPI_WEBHOOK_SECRET
  );

  if (!isValidSignature) {
    console.error("Wompi webhook signature verification failed");
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.event) {
      case "transaction.updated": {
        const transaction = event.data.transaction;
        
        if (transaction.status === "APPROVED") {
          // Parse metadata from reference (format: "userId:packageId")
          const [userId, packageId] = transaction.reference.split(":");
          
          if (userId && packageId) {
            await processPurchaseService(
              parseInt(userId),
              transaction.id,
              parseInt(packageId)
            );
            console.log(`Credits purchased for user ${userId}, transaction: ${transaction.id}`);
          }
        } else if (transaction.status === "DECLINED" || transaction.status === "ERROR") {
          console.log(`Payment failed for transaction ${transaction.id}, status: ${transaction.status}`);
        }
        break;
      }
      
      default:
        console.log(`Unhandled Wompi event type: ${event.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Wompi webhook handler failed:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}