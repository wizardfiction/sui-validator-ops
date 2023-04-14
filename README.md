# Sui Validator Operations Automation

The purpose of this repo is to serve as a starting place for automating some of the tasks involved with operating a validator. It relies on subscribing to Move events on-chain to get up to date information about the validator, and in turn uses that information to make decisions about reference gas price.

## Prerequisites

- [Transfer Operation Cap Object](https://github.com/MystenLabs/sui/blob/main/nre/sui_for_node_operators.md#operation-cap) to an operations account. (recommended)

- Ensure that operations account has sufficient gas to cover transaction fees.

- Install either docker or nodejs on your system

## Environment

The application expects the following environment variables:

- `VALIDATOR_ADDRESS`: The address of the validator you are running on behalf of.

- `RPC_URL`: The RPC URL of the network you are operating on.

- `OP_PRIVATE_KEY`: Private key of the operations keypair.

- `GAS_OP_CAP_OBJECT_ID`: The objectId of the operation cap object, owned by the operations keypair.

- `GAS_BUDGET`: The amount of gas to budget for transactions.

## Running

The program can be run either via the included Dockerfile, or directly with node (look in package.json).

When running locally, make sure to populate the environment variables in a `.env` file.

## Current shortcomings

This is really just a starting point, and there are a lot of things that could be improved. Here are some of the things that I would like to add:

- [ ] Error handling in case tx to update reference gas price fails. Currently it won't be retried until next epoch event and is wrapped in a simple try catch statement.
- [ ] Prom metrics. Currently there is no way to monitor the application, and it simply runs on a while loop. Adding a server and throwing together some prometheus metrics would be a good way to monitor the application.
- [ ] Tallying rule. Currently I'm not automating anything related to tallying rule.
- [ ] Price feed. This will need a price feed for Sui.
