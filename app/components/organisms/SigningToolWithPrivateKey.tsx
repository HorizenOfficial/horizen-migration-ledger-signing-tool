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
  FormDescription,
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
import { useEffect, useMemo, useRef, useState } from "react";
import Btc from "@ledgerhq/hw-app-btc";
import { Check, Copy } from "lucide-react";

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
  const [copied, setCopied] = useState(false);
  const form = useSigningForm();

  const { destinationAddress, derivationPathAccount, derivationPathChange, derivationPathIndex} = form.watch();
  // const MESSAGE_TO_SIGN = useMemo(() => "ZENCLAIM" + destinationAddress, [destinationAddress]);
  const MESSAGE_TO_SIGN = useMemo(() => "tZENCLAIM" + destinationAddress, [destinationAddress]);

  const btc = useRef<Btc | null>(null);;

  useEffect(()=> {
    const initializeBtc = async () => {
      try {
        btc.current = new Btc({ transport });
        // Test that Horizen app is open by generating a wallet
        const mainchainKey = await btc.current.getWalletPublicKey("44'/121'/0'/0/0");  
        setTempAddress(mainchainKey.bitcoinAddress)
      } catch {
        setTimeout(() => setHasError(true), 3000);
        console.log('error.....!!!')
      }

    }

    if (transport) {
      initializeBtc();
    }

  }, [transport, hasError])

  useEffect(() => {
    const getAddress = async() => {
      try {
        if (derivationPathAccount !== undefined && derivationPathChange !== undefined && derivationPathIndex !== undefined && btc.current) {
          const newDerivationPath = `${defaultDerivationPath}${derivationPathAccount}'/${derivationPathChange}/${derivationPathIndex}`
          setDerivationPath(newDerivationPath);
    
          const mainchainKey = await btc.current.getWalletPublicKey(newDerivationPath);
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
    setSignedHash("");
    setIsSigning(true);
    setShowDialogSignature(true);

    try {
      const result = await btc.current!.signMessage(derivationPath, Buffer.from(MESSAGE_TO_SIGN).toString("hex"));
      const v = result.v + 27 + 4; // Adjust the recovery byte
      const signature = Buffer.from(v.toString(16) + result.r + result.s, 'hex').toString('base64');

      setSignedHash(signature);
    } catch(e) {
      console.log(`Error message: ${e}`)
    } finally {
      setIsSigning(false);
    }
  }

  const connectingView = (
    <div className="text-center space-y-4">
      <p>Connecting...</p>
      {hasError && <p>Make sure the Horizen app is selected on your Ledger device and the screen shows &quot;Application is ready&quot;. <span className="underline" onClick={() => {setHasError(false)}}>Click here</span> to try again.</p>}
    </div>
  );

  return (
    (!tempAddress || !btc.current) ? connectingView :
    <Card className="min-w-96 max-w-md">
      <CardHeader>
        <CardTitle>Signing Tool for Ledger</CardTitle>
        <CardDescription>
          Provide a valid EIP-55 formatted Ethereum destination address and derivation path for your current Ledger wallet account.
        </CardDescription>
        <CardDescription>
          Make sure you have both the Bitcoin and Horizen apps installed on your Ledger. The Horizen app must be version 2.4.1 or later.
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
              <FormDescription>
                The derivation path is in the format <br/>
                m / 44&apos; / 121&apos; / account&apos; / change / index
              </FormDescription>
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
                            setValueAs: v => v === "" ? undefined : Number(v),
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
                      <Input type="number" 
                        {...field} 
                        {...form.register("derivationPathChange", {
                          setValueAs: v => v === "" ? undefined : Number(v),
                        })}/>
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
                      <Input type="number" 
                        {...field} 
                        {...form.register("derivationPathIndex", {
                          setValueAs: v => v === "" ? undefined : Number(v),
                        })}/>
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
                <div className="flex">
                  <Label htmlFor="zenAddress">Your ZEN address</Label>
                  { copied ? <Check className="ml-2 h-3 w-3 text-gray-500"/> : 
                    <Copy className="ml-2 h-3 w-3 text-gray-500 hover:text-black cursor-pointer" 
                      onClick={() => {
                        navigator.clipboard.writeText(zenAddress).then(()=> {
                          setCopied(true);
                          setTimeout(() => setCopied(false), 1000);
                        })
                      }}/>
                  }
                </div>
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

              <Button 
                type="submit" 
                disabled={isSigning || (!destinationAddress || destinationAddress === "0x" || !zenAddress)}>
                  Sign Message
              </Button>
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
