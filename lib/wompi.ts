import { env } from "@/env";

// Wompi API configuration
const WOMPI_API_URL = "https://production.wompi.co/v1";

export interface WompiTransactionResponse {
  data: {
    id: string;
    amount_in_cents: number;
    currency: string;
    customer_email: string;
    payment_method_type: string;
    payment_method: {
      type: string;
      extra: any;
    };
    status: string;
    reference: string;
    created_at: string;
    finalized_at?: string;
    amount_refunded: number;
    status_message?: string;
    shipping_address?: any;
    redirect_url?: string;
    payment_source_id?: number;
    payment_link_id?: number;
    customer_data?: any;
    billing_data?: any;
  };
}

export interface WompiPaymentIntentRequest {
  amount_in_cents: number;
  currency: string;
  customer_email: string;
  payment_method: {
    type: string;
    installments: number;
  };
  reference: string;
  customer_data?: {
    phone_number?: string;
    full_name?: string;
  };
  shipping_address?: any;
  redirect_url?: string;
  payment_source_id?: number;
}

class WompiClient {
  private apiKey: string;
  private publicKey: string;

  constructor(secretKey: string, publicKey: string) {
    this.apiKey = secretKey;
    this.publicKey = publicKey;
  }

  async createTransaction(data: WompiPaymentIntentRequest): Promise<WompiTransactionResponse> {
    const response = await fetch(`${WOMPI_API_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Wompi API Error: ${error.error?.reason || 'Unknown error'}`);
    }

    return response.json();
  }

  async getTransaction(transactionId: string): Promise<WompiTransactionResponse> {
    const response = await fetch(`${WOMPI_API_URL}/transactions/${transactionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Wompi API Error: ${error.error?.reason || 'Unknown error'}`);
    }

    return response.json();
  }

  getPublicKey(): string {
    return this.publicKey;
  }
}

export const wompi = new WompiClient(env.WOMPI_SECRET_KEY, env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY);

export const getWompiPublicKey = () => {
  return env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
};