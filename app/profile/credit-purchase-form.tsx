"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { SelectCreditPackage } from "@/db/schemas/credits";
import { env } from "@/env";

declare global {
  interface Window {
    WidgetCheckout: any;
  }
}

interface CreditPurchaseFormProps {
  packages: SelectCreditPackage[];
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface PaymentFormProps {
  selectedPackage: SelectCreditPackage;
  onSuccess: () => void;
  onCancel: () => void;
}

function PaymentForm({ selectedPackage, onSuccess, onCancel }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load Wompi widget script
    const script = document.createElement('script');
    script.src = 'https://checkout.wompi.co/widget.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Get transaction ID from backend
      const response = await fetch('/api/credits/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ packageId: selectedPackage.id }),
      });

      const paymentData = await response.json();
      if (!paymentData.transactionId) {
        throw new Error("Failed to create payment intent");
      }


      // Initialize Wompi checkout widget
      const checkout = new window.WidgetCheckout({
        currency: 'COP',
        amountInCents: selectedPackage.priceCents,
        reference: paymentData.transactionId,
        publicKey: env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY,
        redirectUrl: `${window.location.origin}/profile?payment=success`,
      });

      checkout.open((result: any) => {
        if (result.transaction && result.transaction.status === 'APPROVED') {
          onSuccess();
        } else if (result.transaction && result.transaction.status === 'DECLINED') {
          setError('Payment was declined. Please try again.');
        } else if (result.transaction && result.transaction.status === 'ERROR') {
          setError('Payment failed. Please try again.');
        }
        setIsProcessing(false);
      });

    } catch (err: any) {
      setError(err.message || "An error occurred during payment");
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{selectedPackage.name}</CardTitle>
          <CardDescription>
            {selectedPackage.credits} créditos - ${(selectedPackage.priceCents / 100).toFixed(2)}
          </CardDescription>
        </CardHeader>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <p className="text-red-600 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={handlePayment}
          disabled={isProcessing}
          className="flex-1"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Procesando...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pagar ${(selectedPackage.priceCents / 100).toFixed(2)}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export function CreditPurchaseForm({ packages, open, onClose, onSuccess }: CreditPurchaseFormProps) {
  const [selectedPackage, setSelectedPackage] = useState<SelectCreditPackage | null>(null);

  // Reset selected package when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedPackage(null);
      onClose();
    }
  };

  return (
    <>
      {/* Package Selection Dialog */}
      <Dialog open={open && !selectedPackage} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Comprar créditos</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 md:grid-cols-2">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className="cursor-pointer transition-colors hover:border-primary"
                onClick={() => setSelectedPackage(pkg)}
              >
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-lg">{pkg.name}</CardTitle>
                  <div className="text-2xl font-bold py-2">
                    {pkg.credits} créditos
                  </div>
                  <CardDescription className="text-lg font-semibold">
                    ${(pkg.priceCents / 100).toFixed(2)}
                  </CardDescription>
                  <CardDescription className="text-sm">
                    ${((pkg.priceCents / 100) / pkg.credits).toFixed(3)} por crédito
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button className="w-full">
                    Seleccionar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Form Dialog */}
      <Dialog open={open && !!selectedPackage} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pagar con Wompi</DialogTitle>
          </DialogHeader>
          
          {selectedPackage && (
            <PaymentForm
              selectedPackage={selectedPackage}
              onSuccess={onSuccess}
              onCancel={() => setSelectedPackage(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}