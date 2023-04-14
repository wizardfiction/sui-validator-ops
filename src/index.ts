import {
  JsonRpcProvider,
  Connection,
  Ed25519Keypair,
  fromB64,
  RawSigner,
  SIGNATURE_SCHEME_TO_FLAG,
  PRIVATE_KEY_SIZE,
} from "@mysten/sui.js";
import dotenv from "dotenv";
import { updateGasPrice, calculateNewGasPrice } from "./tokenomics";

import { subscribeValidatorEpochInfo } from "./events";

dotenv.config();

const getProvider = (fullnode: string, faucet?: string): JsonRpcProvider => {
  const connection = new Connection({
    fullnode,
    faucet,
  });
  return new JsonRpcProvider(connection);
};

const getSigner = (
  privateKey: string,
  provider: JsonRpcProvider
): RawSigner => {
  const raw = fromB64(privateKey);
  if (
    raw[0] !== SIGNATURE_SCHEME_TO_FLAG.ED25519 ||
    raw.length !== PRIVATE_KEY_SIZE + 1
  ) {
    throw new Error("invalid key");
  }

  const keypair = Ed25519Keypair.fromSecretKey(raw.slice(1));
  return new RawSigner(keypair, provider);
};

async function main() {
  const provider = getProvider(process.env.RPC_URL!);

  const signer = getSigner(process.env.OP_PRIVATE_KEY!, provider);

  await subscribeValidatorEpochInfo(provider, async (v) => {
    if (v.validator_address === process.env.VALIDATOR_ADDRESS) {
      const newGasPrice = calculateNewGasPrice(v);
      try {
        const result = await updateGasPrice(signer, newGasPrice);
        console.log(
          `Updated nextEpochGasPrice to ${newGasPrice}. Transaction result: ${result}`,
          newGasPrice,
          result
        );
      } catch (err) {
        console.error("Error updating gas price", err);
      }
    }
  });

  while (true) {}
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
