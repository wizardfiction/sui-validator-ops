import { JsonRpcProvider, SuiAddress, SuiEvent } from "@mysten/sui.js";
import { MoveEvent, SystemEpochInfo, ValidatorEpochInfo } from "./types";

// Subscribe

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

// Query

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
