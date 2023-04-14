import { RawSigner, TransactionBlock } from "@mysten/sui.js";
import { MoveEvent, ValidatorEpochInfo } from "./types";

export const calculateNewGasPrice = (v: ValidatorEpochInfo): number => {
  // Example of how to calculate validator rewards, based on total staking rewards for the epoch
  // This is a starting place for where you may want to update your reference gas price.
  const validatorRewards =
    (BigInt(v.pool_staking_reward) * BigInt(v.commission_rate)) / BigInt(1000) +
    BigInt(v.storage_fund_staking_reward);
  return 420;
};

export const updateGasPrice = async (signer: RawSigner, gasPrice: number) => {
  const tx = new TransactionBlock();
  tx.setGasBudget(parseInt(process.env.GAS_BUDGET!));
  tx.moveCall({
    target: MoveEvent.RequestSetGasPrice,
    arguments: [
      tx.pure("0x5"),
      tx.object(process.env.GAS_OP_CAP_OBJECT_ID!),
      tx.pure(gasPrice),
    ],
  });
  const result = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
  });
  console.log({ result });
  return result;
};

export function createUnstakeTransaction(stakedSuiId: string) {
  const tx = new TransactionBlock();
  tx.moveCall({
    target: MoveEvent.RequestWithdrawStake,
    arguments: [tx.object("0x5"), tx.object(stakedSuiId)],
  });
  return tx;
}
