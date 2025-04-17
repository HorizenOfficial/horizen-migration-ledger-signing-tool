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
import { useEffect, useRef, useState } from "react";

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
  const [signedHash, setSignedHash] = useState("");
  const [isSigning, setIsSigning] = useState(false);
  const [hasError, setHasError] = useState(false);
  const form = useSigningForm();

  const { destinationAddress } = form.watch();
  const MESSAGE_TO_SIGN = "ZENCLAIM" + destinationAddress;

  const btc = useRef<any>(null);

  useEffect(()=> {
    const getAddress = async () => {
      try {
        console.log('getAddress')
        btc.current = new Btc({ transport });
        let mainchainKey = await btc.current.getWalletPublicKey("44'/121'/0'/0/0");  //receiving key 1
        // const { address } = await btc.current.getAddress("44'/121'/0'/0/0");
  
        console.log(`mainchainKey ${JSON.stringify(mainchainKey)}`);
        setZenAddress(mainchainKey.bitcoinAddress)
        // console.log(`address ${address}`)
      } catch {
        setTimeout(() => setHasError(true), 3000);
        console.log('error.....!!!')
      }

    }
    console.log(`transport ${JSON.stringify(transport)}`)
    if (transport) {
      getAddress();
    }

  }, [transport, hasError])

  const onSubmit = async () => {
    console.log('onSubmit')
    setIsSigning(true);
    setShowDialogSignature(true);

    try {
      // const signature = signMessageWithPrivateKey({
      //   message: MESSAGE_TO_SIGN,
      //   compressed: compressed,
      // });
      // setSignature(signature);
      // setShowDialogSignature(true);

      //Other keys of the same account
      //console.log(await btc.getWalletPublicKey("44'/121'/0'/0/1"));  //receiving key 2
      //console.log(await btc.getWalletPublicKey("44'/121'/0'/1/0"));  //change key 1
      //console.log(await btc.getWalletPublicKey("44'/121'/0'/1/1"));  //change key 2
  
      //message to sign is ZENCLAIM + Horizen2 destination address (with 0x)
      const MESSAGE_TO_SIGN = "ZENCLAIM"+ destinationAddress;
      console.log(`message to sign ${MESSAGE_TO_SIGN}`)
      console.log(`btc, ${JSON.stringify(btc.current)}`)

      //we are testing the signature with the first key of account 0
      const result = await btc.current.signMessage("44'/121'/0'/0/0", Buffer.from(MESSAGE_TO_SIGN).toString("hex"));
      console.log(result);
      var v = result['v'] + 27 + 4;

      
      var signature = Buffer.from(v.toString(16) + result['r'] + result['s'], 'hex').toString('base64');
      console.log("Signature : " + signature);
      setSignedHash("0x" + signature);
    } catch(e) {
      console.log(`Error message: ${e}`)
    } finally {
      setIsSigning(false);
    }
  }

  const connectingView = (
    <div className="text-center space-y-4">
      <p>Connecting...</p>
      {hasError && <p>Make sure the Horizen app is selected on your Ledger device and the screen shows "Application is ready". <span className="underline" onClick={() => {setHasError(false)}}>Click here</span> to try again.</p>}
    </div>
  );

  return (
    !zenAddress ? connectingView:
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

              <Button type="submit" disabled={isSigning}>{'Sign Message'}</Button>
            </div>
          </form>
        </Form>
      </CardContent>

      <SignatureDialog
        signature={signedHash}
        open={showDialogSignature}
        setOpen={setShowDialogSignature}
      />
    </Card>
  );
}

export default SigningToolWithPrivateKey;
