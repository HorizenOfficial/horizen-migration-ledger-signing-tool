"use client";
import { useState } from "react";

import SigningToolWithPrivateKey from "@/app/components/organisms/SigningToolWithPrivateKey";

import { listen } from "@ledgerhq/logs";
 
// Keep this import if you want to use a Ledger Nano S/X/S Plus with the USB protocol and delete the @ledgerhq/hw-transport-webhid import
//import TransportWebUSB from "@ledgerhq/hw-transport-webhid";
// Keep this import if you want to use a Ledger Nano S/X/S Plus with the HID protocol and delete the @ledgerhq/hw-transport-webusb import
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import { Button } from "./components/ui/button";


export default function Home() {
  const [device, setDevice] = useState(null);

  const handleDeviceConnect = async () => {
    console.log('start handle device connect')
    try {
      // Connect to Ledger device with USB protocol
      const transport = await TransportWebUSB.create();
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
    <div className='text-center space-y-4'>
      <Button onClick={handleDeviceConnect}>Connect Ledger Device</Button>
      <p>If you are unable to see your device, make sure your Ledger is unlocked.</p>
      <p>Please ensure you are using Horizen App version 2.2.0 or later. For optimal performance and the best experience, we recommend updating to the latest version.</p>
    </div>
  );

  return (
    <main className="flex items-center justify-center h-screen">
      {device ? <SigningToolWithPrivateKey transport={device}/> : defaultView}
    </main>
  );
}
