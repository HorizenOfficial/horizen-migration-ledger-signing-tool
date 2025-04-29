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
import { Textarea } from "@/app/components/ui/textarea";

import SignatureDialog from "@/app/components/molecules/SignatureDialog";
import { Separator } from "@/app/components/ui/separator";
import useSigningForm from "@/app/hooks/useSigningForm";
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
  const defaultDerivationPath = "44'/121'/";
  const [showDialogSignature, setShowDialogSignature] = useState(false);
  const [tempAddress, setTempAddress] = useState("");
  const [zenAddress, setZenAddress] = useState("");
  const [derivationPath, setDerivationPath] = useState(defaultDerivationPath);
  const [signedHash, setSignedHash] = useState("");
  const [isSigning, setIsSigning] = useState(false);
  const [hasError, setHasError] = useState(false);
  const form = useSigningForm();

  const { destinationAddress, derivationPathAccount, derivationPathChange, derivationPathIndex} = form.watch();
  // const MESSAGE_TO_SIGN = "ZENCLAIM" + destinationAddress;
  const MESSAGE_TO_SIGN = "ZT1CLAIM" + destinationAddress;

  const btc = useRef<any>(null);

  useEffect(()=> {
    const initializeBtc = async () => {
      try {
        console.log('getAddress')
        btc.current = new Btc({ transport });
        // Test that Ledger app is open by generating a wallet
        let mainchainKey = await btc.current.getWalletPublicKey("44'/121'/0'/0/0");  
        console.log(`temp address ${JSON.stringify(mainchainKey)}`);
        setTempAddress(mainchainKey.bitcoinAddress)
      } catch {
        setTimeout(() => setHasError(true), 3000);
        console.log('error.....!!!')
      }

    }
    console.log(`transport ${JSON.stringify(transport)}`)
    if (transport) {
      initializeBtc();
    }

  }, [transport, hasError])

  useEffect(() => {
    const getAddress = async() => {
      try {
        if (derivationPathAccount !== undefined && derivationPathChange !== undefined && derivationPathIndex !== undefined) {
          let newDerivationPath = `${defaultDerivationPath}${derivationPathAccount}'/${derivationPathChange}/${derivationPathIndex}`
          setDerivationPath(newDerivationPath);
    
          let mainchainKey = await btc.current.getWalletPublicKey(newDerivationPath);
          console.log(`mainchainKey ${JSON.stringify(mainchainKey)}`);
          setZenAddress(mainchainKey.bitcoinAddress)
        }
      } catch {
        console.log('error getting address....')
        setZenAddress("");
      }

    }

    getAddress();

  }, [derivationPathAccount, derivationPathChange, derivationPathIndex]);

  const onSubmit = async () => {
    console.log('onSubmit')
    setIsSigning(true);
    setShowDialogSignature(true);

    try {  
      // Message to sign is ZENCLAIM + Horizen2 destination address (with 0x)
      // const MESSAGE_TO_SIGN = "ZENCLAIM" + destinationAddress;
      const MESSAGE_TO_SIGN = "ZT1CLAIM" + destinationAddress;

      console.log(`message to sign ${MESSAGE_TO_SIGN}`)
      console.log(`btc, ${JSON.stringify(btc.current)}`)

      const result = await btc.current.signMessage(derivationPath, Buffer.from(MESSAGE_TO_SIGN).toString("hex"));
      console.log(result);

      const v = result.v + 27 + 4; // Adjust the recovery byte
      const signature = Buffer.from(v.toString(16) + result.r + result.s, 'hex').toString('base64');

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
    !tempAddress ? connectingView:
    <Card className="min-w-96 max-w-md">
      <CardHeader>
        <CardTitle>Signing Tool for Ledger</CardTitle>
        <CardDescription>
          Fill in the form below to sign a message with your Ledger device.
          Make sure you have both the Bitcoin and Horizen apps installed in your Ledger. The Horizen app must be version 2.2.0 or later.
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
                name="derivationPathAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account</FormLabel>
                    <div>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          {...form.register("derivationPathAccount", {
                            ...(derivationPathAccount !== "" 
                              ? { valueAsNumber: true }
                              : {}),
                          })}
                        />
                      </FormControl>
                      </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="derivationPathChange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Change</FormLabel>
                    <div>
                      <FormControl>
                      <Input type="number" {...field} {...form.register("derivationPathChange", derivationPathChange === "" ? {} : { valueAsNumber: true })}/>
                      </FormControl>
                      </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="derivationPathIndex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Index</FormLabel>
                    <div>
                      <FormControl>
                      <Input type="number" {...field} {...form.register("derivationPathIndex", { valueAsNumber: true })}/>
                      </FormControl>
                      </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />
              <div>
                <Label htmlFor="derivationPath">Derivation Path</Label>
                <Textarea
                  id="derivationPath"
                  disabled
                  placeholder={`m/${defaultDerivationPath}`}
                  value={`m/${derivationPath}`}
                />
              </div>

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

              <Button type="submit" disabled={isSigning || (!destinationAddress || destinationAddress === "0x" || derivationPathAccount==="" || derivationPathChange==="" || derivationPathIndex==="" || !zenAddress)}>{'Sign Message'}</Button>
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
