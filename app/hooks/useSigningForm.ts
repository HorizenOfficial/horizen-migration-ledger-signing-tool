import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  destinationAddressValidator,
  derivationPathAccountValidator,
  derivationPathChangeValidator,
  derivationPathIndexValidator
} from "../lib/formValidator";

const formSchema = z.object({
  destinationAddress: destinationAddressValidator,
  derivationPathAccount: derivationPathAccountValidator,
  derivationPathChange: derivationPathChangeValidator,
  derivationPathIndex: derivationPathIndexValidator,
});

type FormValues = z.infer<typeof formSchema>;

function useSigningForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destinationAddress: "0x",
      derivationPathAccount: "",
      derivationPathChange: "",
      derivationPathIndex: ""
    },
  });

  return form;
}

export type { FormValues };
export default useSigningForm;
