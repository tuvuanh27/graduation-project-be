import { Injectable, OnModuleInit } from '@nestjs/common';
import { Web3Service } from '@libs/web3';
import { LoggerService } from '@libs/shared';
import { ConfigService } from '@nestjs/config';
import { EEnvKey } from '@libs/configs/env.constant';
import NFT_ABI from '@assets/abi/nft.abi.json';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { NftAbi } from '@assets/abi';
import { IIpfsResponse, IQueueCrawl, TransactionConfig } from './types';
import { EventData } from 'web3-eth-contract';
import {
  AddViewer,
  ChangeTokenPublic,
  RemoveViewer,
  TokenMinted,
  Transfer,
} from '@assets/abi/NftAbi';
import { LatestBlockRepository } from '@libs/database/repositories/latest-block.repository';
import { CRAWLER_QUEUE } from '@libs/queue';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import bluebird from 'bluebird';
import { NftTransferRepository } from '@libs/database/repositories/nft-transfer.repository';
import { NftRepository } from '@libs/database/repositories/nft.repository';
import { InjectRedis } from '@libs/redis/redis-core';
import Redis from 'ioredis';
import { CRAWLER_CACHE } from '@libs/redis/constants';
import { NftPendingRepository } from '@libs/database/repositories/nft-pending.repository';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable()
export class CrawlerService implements OnModuleInit {
  private nftContract: NftAbi;
  private web3: Web3;
  private blockCrawled: number;
  private queueName = CRAWLER_QUEUE;
  private readonly logger = this.loggerService.getLogger(CrawlerService.name);
  private readonly zeroAddress = '0x0000000000000000000000000000000000000000';
  private readonly blockProcess = 1000;

  constructor(
    private readonly web3Service: Web3Service,
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly latestBlockRepository: LatestBlockRepository,
    private readonly nftTransferRepository: NftTransferRepository,
    private readonly nftRepository: NftRepository,
    private readonly nftPendingRepository: NftPendingRepository,

    @InjectQueue(CRAWLER_QUEUE) private readonly queue: Queue<IQueueCrawl>,
    @InjectRedis(CRAWLER_CACHE) private readonly redisClient: Redis,

    private readonly httpService: HttpService,
  ) {
    this.web3 = this.web3Service.getClient();
    this.nftContract = new this.web3.eth.Contract(
      NFT_ABI.abi as AbiItem[],
      this.configService.get<string>(EEnvKey.CONTRACT_ADDRESS),
    ) as unknown as NftAbi;
  }

  async onModuleInit() {
    this.logger.debug('Crawler service initialized');

    // check if started crawl before, if not, create new
    const latestCrawledBlock =
      await this.latestBlockRepository.getLatestBlockNftCrawled();

    if (!latestCrawledBlock) {
      await this.latestBlockRepository.createLatestBlockNftCrawled({
        queueName: this.queueName,
        currentBlockNumber: this.configService.get<number>(EEnvKey.START_BLOCK),
        blockPerProcess: this.blockProcess,
      });
    }

    const isCrawlLatestBlock =
      this.configService.get<string>(EEnvKey.CRAWL_LATEST) === 'true';
    this.logger.debug(`Crawl latest block: ${isCrawlLatestBlock}`);

    if (isCrawlLatestBlock) {
      this.logger.log(`Crawling from latest block`);
      this.blockCrawled = await this.getCurrentBlockNumber();
    } else {
      this.logger.log(`Crawling from block in database`);
      this.blockCrawled = (
        await this.latestBlockRepository.getLatestBlockNftCrawled()
      )?.currentBlockNumber;
    }
    this.logger.debug(`Block crawled: ${this.blockCrawled}`);
    await this.produceJobCrawler();
  }

  getCurrentBlockNumber() {
    return this.web3Service.getClient().eth.getBlockNumber();
  }

  async getOwner(): Promise<string> {
    const contractOwner = await this.nftContract.methods.owner().call();
    this.logger.log(`Contract owner: ${contractOwner}`);
    return contractOwner;
  }

  async getNftInfo(hash: string): Promise<IIpfsResponse> {
    const ipfsHost = this.configService.get<string>(EEnvKey.IPFS_HOST);
    const res = this.httpService.get<IIpfsResponse>(`${ipfsHost}${hash}`);
    return (await lastValueFrom(res)).data;
  }

  async produceJobCrawler() {
    const currentBlockNumber = await this.getCurrentBlockNumber();
    this.logger.debug(`Current block number: ${currentBlockNumber}`);

    if (this.blockCrawled < currentBlockNumber) {
      const toBlock =
        this.blockCrawled + this.blockProcess <= currentBlockNumber
          ? this.blockCrawled + this.blockProcess
          : currentBlockNumber;
      this.logger.log(`Crawling from block ${this.blockCrawled} to ${toBlock}`);
      try {
        await this.queue.add({
          fromBlock: this.blockCrawled + 1,
          toBlock,
        });
      } catch (error) {
        this.logger.error(error);
        await bluebird.delay(5000);
        await this.produceJobCrawler();
      }

      await this.latestBlockRepository.updateLatestBlockNftCrawled(
        this.queueName,
        toBlock,
      );
      this.blockCrawled = toBlock;
      await bluebird.delay(1000);
      await this.produceJobCrawler();
    } else {
      this.logger.warn('No new block to crawl, waiting 5s ...');
      await bluebird.delay(5000);
      await this.produceJobCrawler();
    }
  }

  async mintNft() {
    const privateKey = this.configService.get<string>(
      EEnvKey.OWNER_PRIVATE_KEY,
    );
    const contractOwner = await this.getOwner();
    const tx: TransactionConfig = {
      from: contractOwner,
      to: this.configService.get<string>(EEnvKey.CONTRACT_ADDRESS),
      gas: 1000000,
      data: this.nftContract.methods.mint('test mint', true).encodeABI(),
      value: 1,
    };
    const signedTx = await this.web3.eth.accounts.signTransaction(
      tx,
      privateKey,
    );
    const receipt = await this.web3.eth.sendSignedTransaction(
      signedTx.rawTransaction,
    );
    this.logger.log(`Mint NFT: ${receipt.transactionHash}`);
  }

  async getAllEvents(fromBlock: number, toBlock: number): Promise<EventData[]> {
    return this.nftContract.getPastEvents('allEvents', {
      fromBlock,
      toBlock,
    });
  }

  async getBlockTime(blockNumber: number): Promise<number> {
    try {
      const timestamp = await this.redisClient.get(`block:${blockNumber}`);
      if (timestamp) {
        return Number(timestamp);
      }
      const block = await this.web3.eth.getBlock(blockNumber);

      // set cache in 1 day
      await this.redisClient.set(
        `block:${blockNumber}`,
        block.timestamp,
        'EX',
        86400,
      );

      return Number(block.timestamp);
    } catch (error) {
      this.logger.error(error);
      return 0;
    }
  }

  async handleTransferNft(event: Transfer): Promise<void> {
    const { from, to, tokenId } = event.returnValues;
    // if mint
    if (from === this.zeroAddress) {
      return;
    }
    // if burn or transfer
    await this.nftTransferRepository.createNftTransfer({
      from: from.toLowerCase(),
      to: to.toLowerCase(),
      tokenId,
      blockNumber: event.blockNumber,
      txHash: event.transactionHash,
      contractAddress: this.configService.get<string>(EEnvKey.CONTRACT_ADDRESS),
      blockTime: await this.getBlockTime(event.blockNumber),
    });
    // update nft owner
    await this.nftRepository.updateOwnerNft(tokenId, to.toLowerCase());
    await this.nftPendingRepository.updateNftPendingByFilter(
      { nftId: tokenId },
      {
        owner: to.toLowerCase(),
      },
    );
  }

  async handleMintNft(event: TokenMinted): Promise<void> {
    const { minter, tokenId, isPublic, uri } = event.returnValues;
    await this.nftTransferRepository.createNftTransfer({
      from: this.zeroAddress,
      to: minter.toLowerCase(),
      tokenId,
      blockNumber: event.blockNumber,
      txHash: event.transactionHash,
      contractAddress: this.configService.get<string>(EEnvKey.CONTRACT_ADDRESS),
      blockTime: await this.getBlockTime(event.blockNumber),
    });
    const nftInfo = await this.getNftInfo(uri);

    // update nft owner
    await this.nftRepository.createNft({
      tokenId,
      uri,
      contractAddress: this.configService.get<string>(EEnvKey.CONTRACT_ADDRESS),
      owner: minter.toLowerCase(),
      isPublic: isPublic === true,
      blockNumberCreated: event.blockNumber,
      blockTimeCreated: await this.getBlockTime(event.blockNumber),
      name: nftInfo.name,
      description: nftInfo.description,
      metadata: nftInfo,
    });

    // update back to nft pending
    await this.nftPendingRepository.updateNftPendingByFilter(
      { ipfsHash: uri },
      {
        isUploaded: true,
        nftId: tokenId,
        owner: minter.toLowerCase(),
      },
    );
  }

  async handleChangePublicNft(event: ChangeTokenPublic): Promise<void> {
    const { tokenId, isPublic } = event.returnValues;
    await this.nftRepository.updateNftPublic(tokenId, isPublic);
    await this.nftPendingRepository.updateNftPendingByFilter(
      { nftId: tokenId },
      {
        isPublic: isPublic,
      },
    );
  }

  async handleAddViewer(event: AddViewer) {
    const { tokenId } = event.returnValues;
    const owner = await this.getOwner();

    const viewers: string[] = await this.nftContract.methods
      .getTokenViewers(tokenId)
      .call({
        from: owner,
      });

    await this.nftRepository.updateNftViewers(tokenId, viewers);
  }

  async handleRemoveViewer(event: RemoveViewer) {
    const { tokenId } = event.returnValues;
    const owner = await this.getOwner();
    const viewers: string[] = await this.nftContract.methods
      .getTokenViewers(tokenId)
      .call({
        from: owner,
      });

    await this.nftRepository.updateNftViewers(tokenId, viewers);
  }
}
