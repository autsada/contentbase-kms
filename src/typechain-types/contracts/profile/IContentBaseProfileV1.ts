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
  export type ProfileStruct = {
    owner: PromiseOrValue<string>;
    handle: PromiseOrValue<string>;
    imageURI: PromiseOrValue<string>;
  };

  export type ProfileStructOutput = [string, string, string] & {
    owner: string;
    handle: string;
    imageURI: string;
  };
}

export interface IContentBaseProfileV1Interface extends utils.Interface {
  functions: {
    "createProfile(string,string,string)": FunctionFragment;
    "getDefaultProfile()": FunctionFragment;
    "profileExist(uint256)": FunctionFragment;
    "profileOwner(uint256)": FunctionFragment;
    "setDefaultProfile(string)": FunctionFragment;
    "updateProfileImage(uint256,string)": FunctionFragment;
    "validateHandle(string)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "createProfile"
      | "getDefaultProfile"
      | "profileExist"
      | "profileOwner"
      | "setDefaultProfile"
      | "updateProfileImage"
      | "validateHandle"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "createProfile",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getDefaultProfile",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "profileExist",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "profileOwner",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setDefaultProfile",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "updateProfileImage",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "validateHandle",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(
    functionFragment: "createProfile",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getDefaultProfile",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "profileExist",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "profileOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setDefaultProfile",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateProfileImage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "validateHandle",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IContentBaseProfileV1 extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IContentBaseProfileV1Interface;

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
    createProfile(
      handle: PromiseOrValue<string>,
      imageURI: PromiseOrValue<string>,
      originalHandle: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getDefaultProfile(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, DataTypes.ProfileStructOutput] & { tokenId: BigNumber }
    >;

    profileExist(
      profileId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    profileOwner(
      profileId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    setDefaultProfile(
      handle: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateProfileImage(
      tokenId: PromiseOrValue<BigNumberish>,
      newImageURI: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    validateHandle(
      handle: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };

  createProfile(
    handle: PromiseOrValue<string>,
    imageURI: PromiseOrValue<string>,
    originalHandle: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getDefaultProfile(
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, DataTypes.ProfileStructOutput] & { tokenId: BigNumber }
  >;

  profileExist(
    profileId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  profileOwner(
    profileId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  setDefaultProfile(
    handle: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateProfileImage(
    tokenId: PromiseOrValue<BigNumberish>,
    newImageURI: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  validateHandle(
    handle: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    createProfile(
      handle: PromiseOrValue<string>,
      imageURI: PromiseOrValue<string>,
      originalHandle: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    getDefaultProfile(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, DataTypes.ProfileStructOutput] & { tokenId: BigNumber }
    >;

    profileExist(
      profileId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    profileOwner(
      profileId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    setDefaultProfile(
      handle: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    updateProfileImage(
      tokenId: PromiseOrValue<BigNumberish>,
      newImageURI: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    validateHandle(
      handle: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {};

  estimateGas: {
    createProfile(
      handle: PromiseOrValue<string>,
      imageURI: PromiseOrValue<string>,
      originalHandle: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getDefaultProfile(overrides?: CallOverrides): Promise<BigNumber>;

    profileExist(
      profileId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    profileOwner(
      profileId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setDefaultProfile(
      handle: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateProfileImage(
      tokenId: PromiseOrValue<BigNumberish>,
      newImageURI: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    validateHandle(
      handle: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    createProfile(
      handle: PromiseOrValue<string>,
      imageURI: PromiseOrValue<string>,
      originalHandle: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getDefaultProfile(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    profileExist(
      profileId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    profileOwner(
      profileId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setDefaultProfile(
      handle: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateProfileImage(
      tokenId: PromiseOrValue<BigNumberish>,
      newImageURI: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    validateHandle(
      handle: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
