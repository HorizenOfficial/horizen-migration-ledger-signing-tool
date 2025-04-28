import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { useState } from "react";
import { Textarea } from "../ui/textarea";

function SignatureDialog({
  signature,
  open,
  setOpen,
}: {
  signature: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClipboard = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(signature);
  };

  const handleClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => {
        setIsCopied(false);
      }, 150);
    }
  };

  const confirmContent = (
    <>
      <DialogTitle></DialogTitle>
      <DialogDescription>
        Confirm the message hash on your Ledger device
      </DialogDescription>
    </>
  );

  const dialogContent = (
    !signature ? confirmContent : (
      <>
      <DialogHeader>
      <DialogTitle>Your signed message</DialogTitle>
      <DialogDescription>
        Use the signed message below to claim your ZEN.
      </DialogDescription>
    </DialogHeader>
    <div>
      <Textarea disabled value={signature} />
    </div>
    <DialogFooter>
      <Button
        className="mt-2 md:mt-0"
        disabled={isCopied}
        variant={"outline"}
        onClick={handleCopyToClipboard}
      >
        {isCopied ? "Copied!" : "Copy"}
      </Button>
      <DialogClose asChild>
        <Button>Close</Button>
      </DialogClose>
    </DialogFooter>
    </>
    )
  )

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
}

export default SignatureDialog;
