import {
  JsonRpcProvider,
  Connection,
  Ed25519Keypair,
  fromB64,
  RawSigner,
  SIGNATURE_SCHEME_TO_FLAG,
  PRIVATE_KEY_SIZE,
} from "@mysten/sui.js";
import {
  GAUCHO_ADDRESS,
  validatorEpochInfo,
  systemEpochInfo,
} from "./tokenomics";

import { subscribeValidatorEpochInfo } from "./subscriber";

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
  // const provider = getProvider("https://rpc-testnet.suiscan.xyz:443/");
  const provider = getProvider("https://rpc.mainnet.sui.io:443");

  const gauchoInfo = await validatorEpochInfo(provider, GAUCHO_ADDRESS);
  const validatorInfo = await validatorEpochInfo(provider);
  const systemInfo = await systemEpochInfo(provider);

  console.log(gauchoInfo);
  console.log(systemInfo);

  const handle1 = await subscribeValidatorEpochInfo(provider, (v) => {
    console.log("VALIDATOR: ", v);
    if (v.validator_address === GAUCHO_ADDRESS) {
      console.log(v);
      const validatorRewards =
        (BigInt(v.pool_staking_reward) * BigInt(v.commission_rate)) /
          BigInt(1000) +
        BigInt(v.storage_fund_staking_reward);

      console.log("VALIDATOR REWARDS: ", validatorRewards);
    }
  });

  while (true) {}
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
