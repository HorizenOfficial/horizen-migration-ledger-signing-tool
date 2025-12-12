import { getAddress, isAddress } from "viem";
import { z } from "zod";

const destinationAddressValidator = z.string().refine(  
  (addr) => {
  if (!isAddress(addr)) return false;          // basic validation
  return addr === getAddress(addr);            // checksum validation
}, {
  message: "Destination address is not a valid EIP-55 formatted Ethereum address",
});

const derivationPathAccountValidator = z.number().gte(0);
const derivationPathChangeValidator = z.number().refine(val => val === 0 || val === 1, {
  message: "Value must be 0 or 1",
});
const derivationPathIndexValidator = z.number().gte(0);

export {
  destinationAddressValidator,
  derivationPathAccountValidator,
  derivationPathChangeValidator,
  derivationPathIndexValidator
};
