import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { Order } from "@/lib/types";
import { placeholderImages } from "@/lib/placeholder-images";
import { CheckCircle, QrCode } from "lucide-react";

interface ReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

export function ReservationDialog({ open, onOpenChange, order }: ReservationDialogProps) {
  const qrCodeImage = placeholderImages['qr-code'];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline">
            <CheckCircle className="h-6 w-6 text-primary" />
            Reservation Confirmed!
          </DialogTitle>
          <DialogDescription>
            Your meal is reserved. Show this QR code at the kitchen to pick up your order.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <div className="rounded-lg overflow-hidden border-4 border-primary p-2 bg-white">
            {qrCodeImage ? (
                <Image
                    src={qrCodeImage.imageUrl}
                    alt={qrCodeImage.description}
                    data-ai-hint={qrCodeImage.imageHint}
                    width={200}
                    height={200}
                />
            ) : (
                <div className="w-[200px] h-[200px] bg-muted flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-muted-foreground" />
                </div>
            )}
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Your pickup code:</p>
            <p className="font-mono text-lg font-bold tracking-widest">{order?.qrCodeData}</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
