import { DialogTrigger } from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '../../../../shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle
} from '../../../../shared/components/ui/dialog';
import { Label } from '../../../../shared/components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../../../shared/components/ui/radio-group';
import { Separator } from '../../../../shared/components/ui/separator';
import { Event } from '../../interfaces/event.interface';

interface BuyTicketsModalProps {
  event: Event;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  children?: React.ReactNode;
}

export const BuyTicketsModal = ({ event, isOpen, setIsOpen, children }: BuyTicketsModalProps) => {
  const [ticketCount, setTicketCount] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = isOpen !== undefined && setIsOpen !== undefined;
  const dialogOpen = isControlled ? isOpen : internalOpen;

  const handleOpenChange = (open: boolean) => {
    if (isControlled) {
      setIsOpen?.(open);
    } else {
      setInternalOpen(open);
    }
  };

  useEffect(() => {
    if (isControlled) {
      setInternalOpen(isOpen!); // Sync internal state if controlled
    }
  }, [isOpen]);

  const remainingTickets =
    event.maxAttendees && event.currentAttendees !== undefined ? event.maxAttendees - event.currentAttendees : null;

  const handleConfirmPurchase = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      handleOpenChange(false);
      toast.success(`Successfully purchased ${ticketCount} ticket(s)!`);
    }, 1500);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogPortal>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Purchase Tickets</DialogTitle>
            <DialogDescription>Complete your ticket purchase for {event.title}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div>
              <Label htmlFor="tickets" className="text-base">
                How many tickets?
              </Label>
              <div className="flex items-center mt-2">
                <Button
                  variant="outline"
                  onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                  disabled={ticketCount <= 1}
                  className="h-10 px-3">
                  -
                </Button>
                <div className="w-16 mx-2 text-center font-medium text-lg">{ticketCount}</div>
                <Button
                  variant="outline"
                  onClick={() => setTicketCount(Math.min(remainingTickets || 10, ticketCount + 1))}
                  disabled={remainingTickets ? ticketCount >= remainingTickets : false}
                  className="h-10 px-3">
                  +
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-base">Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-2 space-y-2">
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex-1 cursor-pointer">
                    Credit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                    PayPal
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="apple" id="apple" />
                  <Label htmlFor="apple" className="flex-1 cursor-pointer">
                    Apple Pay
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Ticket price:</span>
                <span>
                  ${event.price ? event.price.toFixed(2) : '0.00'} × {ticketCount}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span>Service fee:</span>
                <span>${event.price ? (event.price * 0.1 * ticketCount).toFixed(2) : '0.00'}</span>
              </div>

              <Separator className="my-2" />

              <div className="flex justify-between items-center font-bold">
                <span>Total:</span>
                <span>${event.price ? (event.price * ticketCount * 1.1).toFixed(2) : '0.00'}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                handleOpenChange(false);
              }}>
              Cancel
            </Button>
            <Button onClick={handleConfirmPurchase} isLoading={isProcessing}>
              Complete Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
