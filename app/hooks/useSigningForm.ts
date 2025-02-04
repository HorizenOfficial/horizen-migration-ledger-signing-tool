import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  compressedValidator,
  destinationAddressValidator,
  testnetValidator,
} from "../lib/formValidator";

const formSchema = z.object({
  destinationAddress: destinationAddressValidator,
  testnet: testnetValidator,
  compressed: compressedValidator,
});

type FormValues = z.infer<typeof formSchema>;

function useSigningForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destinationAddress: "0x",
      testnet: false,
      compressed: true,
    },
  });

  return form;
}

export type { FormValues };
export default useSigningForm;
