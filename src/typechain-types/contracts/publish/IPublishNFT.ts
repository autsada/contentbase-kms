/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export declare namespace DataTypes {
  export type CreatePublishDataStruct = {
    creatorId: PromiseOrValue<BigNumberish>;
    imageURI: PromiseOrValue<string>;
    contentURI: PromiseOrValue<string>;
    metadataURI: PromiseOrValue<string>;
    title: PromiseOrValue<string>;
    description: PromiseOrValue<string>;
    primaryCategory: PromiseOrValue<BigNumberish>;
    secondaryCategory: PromiseOrValue<BigNumberish>;
    tertiaryCategory: PromiseOrValue<BigNumberish>;
  };

  export type CreatePublishDataStructOutput = [
    BigNumber,
    string,
    string,
    string,
    string,
    string,
    number,
    number,
    number
  ] & {
    creatorId: BigNumber;
    imageURI: string;
    contentURI: string;
    metadataURI: string;
    title: string;
    description: string;
    primaryCategory: number;
    secondaryCategory: number;
    tertiaryCategory: number;
  };

  export type PublishStruct = {
    owner: PromiseOrValue<string>;
    tokenId: PromiseOrValue<BigNumberish>;
    creatorId: PromiseOrValue<BigNumberish>;
    likes: PromiseOrValue<BigNumberish>;
    imageURI: PromiseOrValue<string>;
    contentURI: PromiseOrValue<string>;
    metadataURI: PromiseOrValue<string>;
  };

  export type PublishStructOutput = [
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    string,
    string,
    string
  ] & {
    owner: string;
    tokenId: BigNumber;
    creatorId: BigNumber;
    likes: BigNumber;
    imageURI: string;
    contentURI: string;
    metadataURI: string;
  };

  export type UpdatePublishDataStruct = {
    tokenId: PromiseOrValue<BigNumberish>;
    creatorId: PromiseOrValue<BigNumberish>;
    imageURI: PromiseOrValue<string>;
    contentURI: PromiseOrValue<string>;
    metadataURI: PromiseOrValue<string>;
    title: PromiseOrValue<string>;
    description: PromiseOrValue<string>;
    primaryCategory: PromiseOrValue<BigNumberish>;
    secondaryCategory: PromiseOrValue<BigNumberish>;
    tertiaryCategory: PromiseOrValue<BigNumberish>;
  };

  export type UpdatePublishDataStructOutput = [
    BigNumber,
    BigNumber,
    string,
    string,
    string,
    string,
    string,
    number,
    number,
    number
  ] & {
    tokenId: BigNumber;
    creatorId: BigNumber;
    imageURI: string;
    contentURI: string;
    metadataURI: string;
    title: string;
    description: string;
    primaryCategory: number;
    secondaryCategory: number;
    tertiaryCategory: number;
  };
}

export interface IPublishNFTInterface extends utils.Interface {
  functions: {
    "createPublish((uint256,string,string,string,string,string,uint8,uint8,uint8))": FunctionFragment;
    "getPublishes(uint256[])": FunctionFragment;
    "like(uint256)": FunctionFragment;
    "ownerOfPublish(uint256)": FunctionFragment;
    "ownerPublishes(uint256[])": FunctionFragment;
    "publishById(uint256)": FunctionFragment;
    "publishesCount()": FunctionFragment;
    "setLikeContractAddress(address)": FunctionFragment;
    "setProfileContract(address)": FunctionFragment;
    "unLike(uint256)": FunctionFragment;
    "updatePublish((uint256,uint256,string,string,string,string,string,uint8,uint8,uint8))": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "createPublish"
      | "getPublishes"
      | "like"
      | "ownerOfPublish"
      | "ownerPublishes"
      | "publishById"
      | "publishesCount"
      | "setLikeContractAddress"
      | "setProfileContract"
      | "unLike"
      | "updatePublish"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "createPublish",
    values: [DataTypes.CreatePublishDataStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "getPublishes",
    values: [PromiseOrValue<BigNumberish>[]]
  ): string;
  encodeFunctionData(
    functionFragment: "like",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "ownerOfPublish",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "ownerPublishes",
    values: [PromiseOrValue<BigNumberish>[]]
  ): string;
  encodeFunctionData(
    functionFragment: "publishById",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "publishesCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setLikeContractAddress",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setProfileContract",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "unLike",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "updatePublish",
    values: [DataTypes.UpdatePublishDataStruct]
  ): string;

  decodeFunctionResult(
    functionFragment: "createPublish",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPublishes",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "like", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "ownerOfPublish",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "ownerPublishes",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "publishById",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "publishesCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setLikeContractAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setProfileContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "unLike", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "updatePublish",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IPublishNFT extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IPublishNFTInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    createPublish(
      createPublishData: DataTypes.CreatePublishDataStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getPublishes(
      tokenIds: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<[DataTypes.PublishStructOutput[]]>;

    like(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    ownerOfPublish(
      publishId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    ownerPublishes(
      tokenIds: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<[DataTypes.PublishStructOutput[]]>;

    publishById(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[DataTypes.PublishStructOutput]>;

    publishesCount(overrides?: CallOverrides): Promise<[BigNumber]>;

    setLikeContractAddress(
      likeContractAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setProfileContract(
      profileContractAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    unLike(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updatePublish(
      updatePublishData: DataTypes.UpdatePublishDataStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  createPublish(
    createPublishData: DataTypes.CreatePublishDataStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getPublishes(
    tokenIds: PromiseOrValue<BigNumberish>[],
    overrides?: CallOverrides
  ): Promise<DataTypes.PublishStructOutput[]>;

  like(
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  ownerOfPublish(
    publishId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  ownerPublishes(
    tokenIds: PromiseOrValue<BigNumberish>[],
    overrides?: CallOverrides
  ): Promise<DataTypes.PublishStructOutput[]>;

  publishById(
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<DataTypes.PublishStructOutput>;

  publishesCount(overrides?: CallOverrides): Promise<BigNumber>;

  setLikeContractAddress(
    likeContractAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setProfileContract(
    profileContractAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  unLike(
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updatePublish(
    updatePublishData: DataTypes.UpdatePublishDataStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    createPublish(
      createPublishData: DataTypes.CreatePublishDataStruct,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPublishes(
      tokenIds: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<DataTypes.PublishStructOutput[]>;

    like(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    ownerOfPublish(
      publishId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    ownerPublishes(
      tokenIds: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<DataTypes.PublishStructOutput[]>;

    publishById(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<DataTypes.PublishStructOutput>;

    publishesCount(overrides?: CallOverrides): Promise<BigNumber>;

    setLikeContractAddress(
      likeContractAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setProfileContract(
      profileContractAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    unLike(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    updatePublish(
      updatePublishData: DataTypes.UpdatePublishDataStruct,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    createPublish(
      createPublishData: DataTypes.CreatePublishDataStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getPublishes(
      tokenIds: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    like(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    ownerOfPublish(
      publishId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    ownerPublishes(
      tokenIds: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    publishById(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    publishesCount(overrides?: CallOverrides): Promise<BigNumber>;

    setLikeContractAddress(
      likeContractAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setProfileContract(
      profileContractAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    unLike(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updatePublish(
      updatePublishData: DataTypes.UpdatePublishDataStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    createPublish(
      createPublishData: DataTypes.CreatePublishDataStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getPublishes(
      tokenIds: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    like(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    ownerOfPublish(
      publishId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    ownerPublishes(
      tokenIds: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    publishById(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    publishesCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setLikeContractAddress(
      likeContractAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setProfileContract(
      profileContractAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    unLike(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updatePublish(
      updatePublishData: DataTypes.UpdatePublishDataStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
