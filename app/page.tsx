"use client";
import { useState } from "react";
import SigningToolWithPrivateKey from "@/app/components/organisms/SigningToolWithPrivateKey";
import Transport from "@ledgerhq/hw-transport";
import { listen } from "@ledgerhq/logs";
import { Button } from "./components/ui/button";


export default function Home() {
  const [device, setDevice] = useState<Transport | null>(null);

  const handleDeviceConnect = async () => {
    console.log('start handle device connect')
    try {
      let transport;

      if ("hid" in navigator) {
        const TransportWebHID = (await import("@ledgerhq/hw-transport-webhid")).default;
        transport = await TransportWebHID.create();
      } else if ("usb" in navigator) {
        const TransportWebUSB = (await import("@ledgerhq/hw-transport-webusb")).default;
        transport = await TransportWebUSB.create();
      } else {
        throw new Error("This browser does not support WebHID or WebUSB.");
      }

      // Listen to the events which are sent by the Ledger packages in order to debug the app
      listen((log) => console.log(log))

      // Set the device to state
      setDevice(transport);

      // Log the device info
      console.log('Connected device:', transport);
    } catch (error) {
      console.error('Error while connecting to device:', error);
    }
  };

  const defaultView = (
    <div className='flex items-center justify-center h-screen'>
      <div className='text-center space-y-4'>
        <Button onClick={handleDeviceConnect}>Connect Ledger Device</Button>
        <p>If you are unable to see your device, make sure your Ledger is unlocked.</p>
        <p>Please ensure you are using Horizen App version 2.4.1 or later. We recommend updating to the latest version.</p>
      </div>
    </div>
  );

  return (
    <main className="flex flex-col items-center justify-center">
      {device ? <SigningToolWithPrivateKey transport={device}/> : defaultView}
    </main>
  );
}
