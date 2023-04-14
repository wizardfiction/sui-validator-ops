import { JsonRpcProvider, SuiEvent } from "@mysten/sui.js";
import { MoveEvent, SystemEpochInfo, ValidatorEpochInfo } from "./types";

export const subscribeValidatorEpochInfo = async (
  provider: JsonRpcProvider,
  callback: (event: ValidatorEpochInfo) => void
) => {
  return await provider.subscribeEvent({
    filter: {
      MoveEventType: MoveEvent.ValidatorEpochInfo,
    },
    onMessage: (event: SuiEvent) => {
      callback(event.parsedJson! as ValidatorEpochInfo);
    },
  });
};

export const subscribeSystenEpochInfo = async (
  provider: JsonRpcProvider,
  callback: (event: SystemEpochInfo) => void
) => {
  return await provider.subscribeEvent({
    filter: {
      MoveEventType: MoveEvent.SystemEpochInfo,
    },
    onMessage: (event: SuiEvent) => {
      callback(event.parsedJson! as SystemEpochInfo);
    },
  });
};
