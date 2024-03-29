/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import type BN from "bn.js";
import type { ContractOptions } from "web3-eth-contract";
import type { EventLog } from "web3-core";
import type { EventEmitter } from "events";
import type {
  Callback,
  PayableTransactionObject,
  NonPayableTransactionObject,
  BlockType,
  ContractEventLog,
  BaseContract,
} from "./types";

export interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export type AdminChanged = ContractEventLog<{
  previousAdmin: string;
  newAdmin: string;
  0: string;
  1: string;
}>;
export type BeaconUpgraded = ContractEventLog<{
  beacon: string;
  0: string;
}>;
export type Upgraded = ContractEventLog<{
  implementation: string;
  0: string;
}>;
export type AddViewer = ContractEventLog<{
  tokenId: string;
  viewer: string;
  0: string;
  1: string;
}>;
export type Approval = ContractEventLog<{
  owner: string;
  approved: string;
  tokenId: string;
  0: string;
  1: string;
  2: string;
}>;
export type ApprovalForAll = ContractEventLog<{
  owner: string;
  operator: string;
  approved: boolean;
  0: string;
  1: string;
  2: boolean;
}>;
export type BuyToken = ContractEventLog<{
  tokenId: string;
  buyer: string;
  price: string;
  0: string;
  1: string;
  2: string;
}>;
export type ChangeTokenPublic = ContractEventLog<{
  tokenId: string;
  isPublic: boolean;
  0: string;
  1: boolean;
}>;
export type Initialized = ContractEventLog<{
  version: string;
  0: string;
}>;
export type OwnershipTransferred = ContractEventLog<{
  previousOwner: string;
  newOwner: string;
  0: string;
  1: string;
}>;
export type Paused = ContractEventLog<{
  account: string;
  0: string;
}>;
export type RemoveViewer = ContractEventLog<{
  tokenId: string;
  viewer: string;
  0: string;
  1: string;
}>;
export type SaleToken = ContractEventLog<{
  tokenId: string;
  price: string;
  0: string;
  1: string;
}>;
export type TokenMinted = ContractEventLog<{
  minter: string;
  tokenId: string;
  uri: string;
  price: string;
  isPublic: boolean;
  0: string;
  1: string;
  2: string;
  3: string;
  4: boolean;
}>;
export type Transfer = ContractEventLog<{
  from: string;
  to: string;
  tokenId: string;
  0: string;
  1: string;
  2: string;
}>;
export type Unpaused = ContractEventLog<{
  account: string;
  0: string;
}>;

export interface NftAbi extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): NftAbi;
  clone(): NftAbi;
  methods: {
    /**
     * Returns the current admin. NOTE: Only the admin can call this function. See {ProxyAdmin-getProxyAdmin}. TIP: To get this value clients can read directly from the storage slot shown below (specified by EIP1967) using the https://eth.wiki/json-rpc/API#eth_getstorageat[`eth_getStorageAt`] RPC call. `0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103`
     */
    admin(): NonPayableTransactionObject<string>;

    /**
     * Returns the current implementation. NOTE: Only the admin can call this function. See {ProxyAdmin-getProxyImplementation}. TIP: To get this value clients can read directly from the storage slot shown below (specified by EIP1967) using the https://eth.wiki/json-rpc/API#eth_getstorageat[`eth_getStorageAt`] RPC call. `0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc`
     */
    implementation(): NonPayableTransactionObject<string>;

    /**
     * Upgrade the implementation of the proxy. NOTE: Only the admin can call this function. See {ProxyAdmin-upgrade}.
     */
    upgradeTo(newImplementation: string): NonPayableTransactionObject<void>;

    /**
     * Upgrade the implementation of the proxy, and then call a function from the new implementation as specified by `data`, which should be an encoded function call. This is useful to initialize new storage variables in the proxied contract. NOTE: Only the admin can call this function. See {ProxyAdmin-upgradeAndCall}.
     */
    upgradeToAndCall(
      newImplementation: string,
      data: string | number[]
    ): PayableTransactionObject<void>;

    addTokenViewer(
      tokenId: number | string | BN,
      viewer: string
    ): NonPayableTransactionObject<void>;

    approve(
      to: string,
      tokenId: number | string | BN
    ): NonPayableTransactionObject<void>;

    balanceOf(owner: string): NonPayableTransactionObject<string>;

    burn(tokenId: number | string | BN): NonPayableTransactionObject<void>;

    buyToken(tokenId: number | string | BN): PayableTransactionObject<void>;

    changeTokenPublic(
      tokenId: number | string | BN,
      isPublic: boolean
    ): NonPayableTransactionObject<void>;

    getAllNFTIdsOfAddress(
      account: string
    ): NonPayableTransactionObject<string[]>;

    getApproved(
      tokenId: number | string | BN
    ): NonPayableTransactionObject<string>;

    getTokenViewers(
      tokenId: number | string | BN
    ): NonPayableTransactionObject<string[]>;

    initialize(name: string, symbol: string): NonPayableTransactionObject<void>;

    isApprovedForAll(
      owner: string,
      operator: string
    ): NonPayableTransactionObject<boolean>;

    isNftPublic(
      tokenId: number | string | BN
    ): NonPayableTransactionObject<boolean>;

    isViewer(
      tokenId: number | string | BN,
      viewer: string
    ): NonPayableTransactionObject<boolean>;

    mint(
      _uri: string,
      _isTokenPublic: boolean
    ): PayableTransactionObject<string>;

    mintingFee(): NonPayableTransactionObject<string>;

    name(): NonPayableTransactionObject<string>;

    owner(): NonPayableTransactionObject<string>;

    ownerOf(tokenId: number | string | BN): NonPayableTransactionObject<string>;

    pause(): NonPayableTransactionObject<void>;

    paused(): NonPayableTransactionObject<boolean>;

    removeTokenViewer(
      tokenId: number | string | BN,
      viewer: string
    ): NonPayableTransactionObject<void>;

    renounceOwnership(): NonPayableTransactionObject<void>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: number | string | BN
    ): NonPayableTransactionObject<void>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: number | string | BN,
      data: string | number[]
    ): NonPayableTransactionObject<void>;

    salePrice(arg0: number | string | BN): NonPayableTransactionObject<string>;

    setApprovalForAll(
      operator: string,
      approved: boolean
    ): NonPayableTransactionObject<void>;

    setMintingFee(
      _mintingFee: number | string | BN
    ): NonPayableTransactionObject<void>;

    setSalePrice(
      tokenId: number | string | BN,
      price: number | string | BN
    ): NonPayableTransactionObject<void>;

    supportsInterface(
      interfaceId: string | number[]
    ): NonPayableTransactionObject<boolean>;

    symbol(): NonPayableTransactionObject<string>;

    tokenByIndex(
      index: number | string | BN
    ): NonPayableTransactionObject<string>;

    tokenOfOwnerByIndex(
      owner: string,
      index: number | string | BN
    ): NonPayableTransactionObject<string>;

    tokenURI(
      tokenId: number | string | BN
    ): NonPayableTransactionObject<string>;

    totalSupply(): NonPayableTransactionObject<string>;

    transferFrom(
      from: string,
      to: string,
      tokenId: number | string | BN
    ): NonPayableTransactionObject<void>;

    transferOwnership(newOwner: string): NonPayableTransactionObject<void>;

    unpause(): NonPayableTransactionObject<void>;

    withdraw(): NonPayableTransactionObject<void>;
  };
  events: {
    AdminChanged(cb?: Callback<AdminChanged>): EventEmitter;
    AdminChanged(
      options?: EventOptions,
      cb?: Callback<AdminChanged>
    ): EventEmitter;

    BeaconUpgraded(cb?: Callback<BeaconUpgraded>): EventEmitter;
    BeaconUpgraded(
      options?: EventOptions,
      cb?: Callback<BeaconUpgraded>
    ): EventEmitter;

    Upgraded(cb?: Callback<Upgraded>): EventEmitter;
    Upgraded(options?: EventOptions, cb?: Callback<Upgraded>): EventEmitter;

    AddViewer(cb?: Callback<AddViewer>): EventEmitter;
    AddViewer(options?: EventOptions, cb?: Callback<AddViewer>): EventEmitter;

    Approval(cb?: Callback<Approval>): EventEmitter;
    Approval(options?: EventOptions, cb?: Callback<Approval>): EventEmitter;

    ApprovalForAll(cb?: Callback<ApprovalForAll>): EventEmitter;
    ApprovalForAll(
      options?: EventOptions,
      cb?: Callback<ApprovalForAll>
    ): EventEmitter;

    BuyToken(cb?: Callback<BuyToken>): EventEmitter;
    BuyToken(options?: EventOptions, cb?: Callback<BuyToken>): EventEmitter;

    ChangeTokenPublic(cb?: Callback<ChangeTokenPublic>): EventEmitter;
    ChangeTokenPublic(
      options?: EventOptions,
      cb?: Callback<ChangeTokenPublic>
    ): EventEmitter;

    Initialized(cb?: Callback<Initialized>): EventEmitter;
    Initialized(
      options?: EventOptions,
      cb?: Callback<Initialized>
    ): EventEmitter;

    OwnershipTransferred(cb?: Callback<OwnershipTransferred>): EventEmitter;
    OwnershipTransferred(
      options?: EventOptions,
      cb?: Callback<OwnershipTransferred>
    ): EventEmitter;

    Paused(cb?: Callback<Paused>): EventEmitter;
    Paused(options?: EventOptions, cb?: Callback<Paused>): EventEmitter;

    RemoveViewer(cb?: Callback<RemoveViewer>): EventEmitter;
    RemoveViewer(
      options?: EventOptions,
      cb?: Callback<RemoveViewer>
    ): EventEmitter;

    SaleToken(cb?: Callback<SaleToken>): EventEmitter;
    SaleToken(options?: EventOptions, cb?: Callback<SaleToken>): EventEmitter;

    TokenMinted(cb?: Callback<TokenMinted>): EventEmitter;
    TokenMinted(
      options?: EventOptions,
      cb?: Callback<TokenMinted>
    ): EventEmitter;

    Transfer(cb?: Callback<Transfer>): EventEmitter;
    Transfer(options?: EventOptions, cb?: Callback<Transfer>): EventEmitter;

    Unpaused(cb?: Callback<Unpaused>): EventEmitter;
    Unpaused(options?: EventOptions, cb?: Callback<Unpaused>): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "AdminChanged", cb: Callback<AdminChanged>): void;
  once(
    event: "AdminChanged",
    options: EventOptions,
    cb: Callback<AdminChanged>
  ): void;

  once(event: "BeaconUpgraded", cb: Callback<BeaconUpgraded>): void;
  once(
    event: "BeaconUpgraded",
    options: EventOptions,
    cb: Callback<BeaconUpgraded>
  ): void;

  once(event: "Upgraded", cb: Callback<Upgraded>): void;
  once(event: "Upgraded", options: EventOptions, cb: Callback<Upgraded>): void;

  once(event: "AddViewer", cb: Callback<AddViewer>): void;
  once(
    event: "AddViewer",
    options: EventOptions,
    cb: Callback<AddViewer>
  ): void;

  once(event: "Approval", cb: Callback<Approval>): void;
  once(event: "Approval", options: EventOptions, cb: Callback<Approval>): void;

  once(event: "ApprovalForAll", cb: Callback<ApprovalForAll>): void;
  once(
    event: "ApprovalForAll",
    options: EventOptions,
    cb: Callback<ApprovalForAll>
  ): void;

  once(event: "BuyToken", cb: Callback<BuyToken>): void;
  once(event: "BuyToken", options: EventOptions, cb: Callback<BuyToken>): void;

  once(event: "ChangeTokenPublic", cb: Callback<ChangeTokenPublic>): void;
  once(
    event: "ChangeTokenPublic",
    options: EventOptions,
    cb: Callback<ChangeTokenPublic>
  ): void;

  once(event: "Initialized", cb: Callback<Initialized>): void;
  once(
    event: "Initialized",
    options: EventOptions,
    cb: Callback<Initialized>
  ): void;

  once(event: "OwnershipTransferred", cb: Callback<OwnershipTransferred>): void;
  once(
    event: "OwnershipTransferred",
    options: EventOptions,
    cb: Callback<OwnershipTransferred>
  ): void;

  once(event: "Paused", cb: Callback<Paused>): void;
  once(event: "Paused", options: EventOptions, cb: Callback<Paused>): void;

  once(event: "RemoveViewer", cb: Callback<RemoveViewer>): void;
  once(
    event: "RemoveViewer",
    options: EventOptions,
    cb: Callback<RemoveViewer>
  ): void;

  once(event: "SaleToken", cb: Callback<SaleToken>): void;
  once(
    event: "SaleToken",
    options: EventOptions,
    cb: Callback<SaleToken>
  ): void;

  once(event: "TokenMinted", cb: Callback<TokenMinted>): void;
  once(
    event: "TokenMinted",
    options: EventOptions,
    cb: Callback<TokenMinted>
  ): void;

  once(event: "Transfer", cb: Callback<Transfer>): void;
  once(event: "Transfer", options: EventOptions, cb: Callback<Transfer>): void;

  once(event: "Unpaused", cb: Callback<Unpaused>): void;
  once(event: "Unpaused", options: EventOptions, cb: Callback<Unpaused>): void;
}
