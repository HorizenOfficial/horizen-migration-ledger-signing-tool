import bs58check from "bs58check";
import zencashjs from "zencashjs";

function isPrivateKeyOnWifFormat(privateKey: string): boolean {
  try {
    const WIFdecoded = bs58check.decode(privateKey);

    const prefix = Buffer.from(WIFdecoded).toString("hex").slice(0, 2);

    return (
      prefix === zencashjs.config.mainnet.wif ||
      prefix === zencashjs.config.testnet.wif
    );
  } catch {
    return false;
  }
}

function isMainnetWif(privateKeyWif: string): boolean {
  const WIFdecoded = bs58check.decode(privateKeyWif);
  const prefix = Buffer.from(WIFdecoded).toString("hex").slice(0, 2);

  return prefix === zencashjs.config.mainnet.wif;
}

// function isHex64(value: string): boolean {
//   return value.match(/^[0-9a-fA-F]{64}$/) !== null;
// }

function deriveZenAddressFromPrivateKey({
  privateKey,
  compressed,
  testnet,
}: {
  privateKey: string;
  compressed: boolean;
  testnet: boolean;
}): string {
  let key = privateKey;

  if (isPrivateKeyOnWifFormat(privateKey)) {
    key = zencashjs.address.WIFToPrivKey(privateKey);
  }

  const pubKey = zencashjs.address.privKeyToPubKey(key, compressed);

  const envPubKeyHash = testnet
    ? zencashjs.config.testnet.pubKeyHash
    : zencashjs.config.mainnet.pubKeyHash;

  const address = zencashjs.address.pubKeyToAddr(pubKey, envPubKeyHash);

  return address;
}

export {
  deriveZenAddressFromPrivateKey,
  isMainnetWif,
  isPrivateKeyOnWifFormat,
};
