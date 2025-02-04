import { isAddress } from "viem";
import { z } from "zod";

const destinationAddressValidator = z.string().refine(isAddress, {
  message: "Destination address is not a valid ethereum address",
});

const testnetValidator = z.boolean();
const compressedValidator = z.boolean();

export {
  compressedValidator,
  destinationAddressValidator,
  testnetValidator,
};
