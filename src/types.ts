export enum MoveEvent {
  ValidatorEpochInfo = "0x3::validator_set::ValidatorEpochInfoEventV2",
  SystemEpochInfo = "0x3::sui_system_state_inner::SystemEpochInfoEvent",
  RequestSetGasPrice = "0x3::sui_system::request_set_gas_price",
  RequestWithdrawStake = "0x3::sui_system::request_withdraw_stake",
}

export interface ValidatorEpochInfo {
  commission_rate: string;
  epoch: string;
  pool_staking_reward: string;
  pool_token_exchange_rate: {
    pool_token_amount: string;
    sui_amount: string;
  };
  reference_gas_survey_quote: string;
  stake: string;
  storage_fund_staking_reward: string;
  tallying_rule_global_score: string;
  tallying_rule_reporters: string[];
  validator_address: string;
}

export interface SystemEpochInfo {
  epoch: string;
  leftover_storage_fund_inflow: string;
  protocol_version: string;
  reference_gas_price: string;
  stake_subsidy_amount: string;
  storage_charge: string;
  storage_fund_balance: string;
  storage_fund_reinvestment: string;
  storage_rebate: string;
  total_gas_fees: string;
  total_stake: string;
  total_stake_rewards_distributed: string;
}
