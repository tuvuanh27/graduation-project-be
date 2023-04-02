import { Common } from 'web3-core';
import BN from 'bn.js';

export interface TransactionConfig {
  from?: string | number;
  to?: string;
  value?: number | string | BN;
  gas?: number | string;
  gasPrice?: number | string | BN;
  maxPriorityFeePerGas?: number | string | BN;
  maxFeePerGas?: number | string | BN;
  data?: string;
  nonce?: number;
  chainId?: number;
  common?: Common;
  chain?: string;
  hardfork?: string;
}

export interface IQueueCrawl {
  fromBlock: number;
  toBlock: number;
}

export enum NftEvent {
  Transfer = 'Transfer',
  ChangeTokenPublic = 'ChangeTokenPublic',
  TokenMinted = 'TokenMinted',
}
