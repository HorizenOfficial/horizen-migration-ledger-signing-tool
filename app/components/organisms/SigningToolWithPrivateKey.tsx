"use client";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Switch } from "@/app/components/ui/switch";
import { Textarea } from "@/app/components/ui/textarea";

import SignatureDialog from "@/app/components/molecules/SignatureDialog";
import { Separator } from "@/app/components/ui/separator";
import useSigningForm from "@/app/hooks/useSigningForm";
// import {
//   deriveZenAddressFromPrivateKey,
//   isMainnetWif,
//   isPrivateKeyOnWifFormat,
// } from "@/app/lib/privateKeysUtilities";
// import signMessageWithPrivateKey from "@/app/lib/signMessageWithPrivateKey";
import { useEffect, useState } from "react";

// import { listen } from "@ledgerhq/logs";
import Btc from "@ledgerhq/hw-app-btc";
// import zencashjs from "zencashjs";
 
// Keep this import if you want to use a Ledger Nano S/X/S Plus with the USB protocol and delete the @ledgerhq/hw-transport-webhid import
//import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
// Keep this import if you want to use a Ledger Nano S/X/S Plus with the HID protocol and delete the @ledgerhq/hw-transport-webusb import
// import TransportWebUSB from "@ledgerhq/hw-transport-webusb";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SigningToolWithPrivateKey({transport}: any) {
  const [showDialogSignature, setShowDialogSignature] = useState(false);
  const [zenAddress, setZenAddress] = useState("");
  // const [signature, setSignature] = useState("");
  const signature = '';
  const form = useSigningForm();

  const { destinationAddress } = form.watch();
  const MESSAGE_TO_SIGN = "ZENCLAIM" + destinationAddress;

  useEffect(()=> {
    const getAddress = async() => {
      const btc = new Btc({ transport });
      btc.getWalletPublicKey("44'/121'/0'/0/0").then((key)=> {
        console.log('pubkey', key)
        setZenAddress(key);
      });
    }

    getAddress();

  }, [transport])

  function onSubmit() {
    console.log('onSubmit')


    // const signature = signMessageWithPrivateKey({
    //   message: MESSAGE_TO_SIGN,
    //   compressed: compressed,
    // });
    // setSignature(signature);
    // setShowDialogSignature(true);
  }

  return (
    <Card className="min-w-96 max-w-md">
      <CardHeader>
        <CardTitle>Signing Tool for Ledger</CardTitle>
        <CardDescription>
          Fill in the form below to sign a message with your private key.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid w-full items-center gap-4">
              <FormField
                control={form.control}
                name="destinationAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Destination Address..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="testnet"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Testnet</FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="compressed"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Compressed</FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Separator />

              <div>
                <Label htmlFor="zenAddress">Your ZEN address</Label>
                <Textarea
                  id="zenAddress"
                  disabled
                  placeholder="ZEN Address"
                  value={zenAddress}
                />
              </div>

              <div>
                <Label htmlFor="message">Message to Sign</Label>
                <Textarea
                  id="message"
                  disabled
                  placeholder="Message To Sign"
                  value={MESSAGE_TO_SIGN}
                />
              </div>

              <Button type="submit">Sign Message</Button>
            </div>
          </form>
        </Form>
      </CardContent>

      <SignatureDialog
        signature={signature}
        open={showDialogSignature}
        setOpen={setShowDialogSignature}
      />
    </Card>
  );
}

export default SigningToolWithPrivateKey;
