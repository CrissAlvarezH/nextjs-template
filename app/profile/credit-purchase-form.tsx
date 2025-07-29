"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900">{selectedPackage.name}</h4>
        <p className="text-sm text-gray-600">
          {selectedPackage.credits} créditos - ${(selectedPackage.priceCents / 100).toFixed(2)}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
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
          className="flex-1 bg-blue-600 hover:bg-blue-700"
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
              <div
                key={pkg.id}
                className="border rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                onClick={() => setSelectedPackage(pkg)}
              >
                <div className="text-center">
                  <h4 className="font-semibold text-lg text-gray-900">{pkg.name}</h4>
                  <p className="text-2xl font-bold text-blue-600 my-2">
                    {pkg.credits} créditos
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    ${(pkg.priceCents / 100).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    ${((pkg.priceCents / 100) / pkg.credits).toFixed(3)} por crédito
                  </p>
                  <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700">
                    Seleccionar
                  </Button>
                </div>
              </div>
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