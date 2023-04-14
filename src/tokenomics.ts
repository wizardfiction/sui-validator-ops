import {
  JsonRpcProvider,
  RawSigner,
  SuiSystemStateSummary,
  MIST_PER_SUI,
  SuiEvent,
  SuiAddress,
} from "@mysten/sui.js";
import { MoveEvent, SystemEpochInfo, ValidatorEpochInfo } from "./types";

const SUI_TOKEN_PRICE = 50;
const FIXED_COST = 500;
const GAMMA = 0.5;
const VALIDATOR_REWARD_PROPORTION = GAMMA;
const STORAGE_FUND_REWARD_PROPORTION = 1 - GAMMA;
const GAS_OP_CAP_OBJECT_ID =
  "0x49e6f96e5d3c050433fa05d167c487f6a4708ca15347c53cb94a9a6a113ad420";
export const GAUCHO_ADDRESS =
  "0xdead0072f3a00a250cc8dd90315e92822130258105a494f831ee9bb1576fd71f";
// "0x10052a36a52989971951f741b8497e7d93a5ce1a621dd30e0ae7dbef80e6f982";

// export const calculateGasPrice = (event: SuiEvent) => {
//   if (event.parsedJson?.validator_address !== GAUCHO_ADDRESS) {
//     return;
//   }
//   const tally = event.parsedJson?.tallying_rule_global_score;
//   const stake = event.parsedJson?.stake;
//   const commission = event.parsedJson?.commission_rate;
// };

// const shareOfStake = (state: SuiSystemStateSummary): number => {
//   const gaucho = state.activeValidators.find(
//     (v) => v.suiAddress === GAUCHO_ADDRESS
//   )!;
//   const gauchoStake = gaucho.stakingPoolSuiBalance;
//   return gauchoStake / state.totalStake;
// };

// export const updateGasPrice = async (signer: RawSigner, gasPrice: number) => {
//   const tx = new Transaction();
//   tx.setGasBudget(20000000);
//   tx.moveCall({
//     target: MoveEvent.RequestSetGasPrice,
//     arguments: [
//       tx.pure("0x5"),
//       tx.object(GAS_OP_CAP_OBJECT_ID),
//       tx.pure(gasPrice),
//     ],
//   });
//   const result = await signer.signAndExecuteTransaction({ transaction: tx });
//   console.log({ result });
//   return result;
// };

// export const getReferenceGasPrice = async (
//   provider: JsonRpcProvider
// ): Promise<number> => {
//   const systemState: SuiSystemStateSummary =
//     await provider.getLatestSuiSystemState();
//   fs.writeFileSync("systemState.json", JSON.stringify(systemState, null, 2));
//   const totalStake = systemState.totalStake;
//   const gasValues = systemState.activeValidators.map((v) => [
//     v.nextEpochGasPrice,
//     v.nextEpochStake,
//   ]);

//   gasValues.sort((a, b) => {
//     if (a[0] == b[0]) {
//       return a[1] - b[1];
//     }
//     return a[0] - b[0];
//   });
//   console.log(gasValues);
//   // const twoThirds = Math.floor(gasValues.length * (2 / 3));
//   // const gasPrice = gasValues[twoThirds][0];
//   // console.log(gasPrice);
//   console.log(gasValues.length);
//   console.log(totalStake);
//   console.log("SHARE", shareOfStake(systemState));
//   console.log("MIST", MIST_PER_SUI);
//   return systemState.referenceGasPrice;
// };

export const validatorEpochInfo = async (
  provider: JsonRpcProvider,
  validator?: SuiAddress
): Promise<ValidatorEpochInfo[]> => {
  return await provider
    .queryEvents({
      query: {
        MoveEventType: MoveEvent.ValidatorEpochInfo,
      },
    })
    .then((events) => {
      const info = events.data.map(
        (e: any) => e.parsedJson!
      ) as ValidatorEpochInfo[];
      return validator
        ? info.filter((e) => e.validator_address === validator)
        : info;
    });
};

export const systemEpochInfo = async (
  provider: JsonRpcProvider
): Promise<SystemEpochInfo[]> => {
  return await provider
    .queryEvents({
      query: {
        MoveEventType: MoveEvent.SystemEpochInfo,
      },
    })
    .then((events) => {
      return events.data.map((e: any) => e.parsedJson!) as SystemEpochInfo[];
    });
};
