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
  export type CreateProfileDataStruct = {
    tokenURI: PromiseOrValue<string>;
    handle: PromiseOrValue<string>;
    imageURI: PromiseOrValue<string>;
  };

  export type CreateProfileDataStructOutput = [string, string, string] & {
    tokenURI: string;
    handle: string;
    imageURI: string;
  };

  export type ProfileStruct = {
    tokenId: PromiseOrValue<BigNumberish>;
    owner: PromiseOrValue<string>;
    handle: PromiseOrValue<string>;
    imageURI: PromiseOrValue<string>;
  };

  export type ProfileStructOutput = [BigNumber, string, string, string] & {
    tokenId: BigNumber;
    owner: string;
    handle: string;
    imageURI: string;
  };

  export type UpdateProfileImageDataStruct = {
    tokenId: PromiseOrValue<BigNumberish>;
    tokenURI: PromiseOrValue<string>;
    imageURI: PromiseOrValue<string>;
  };

  export type UpdateProfileImageDataStructOutput = [
    BigNumber,
    string,
    string
  ] & { tokenId: BigNumber; tokenURI: string; imageURI: string };
}

export interface IProfileNFTInterface extends utils.Interface {
  functions: {
    "createProfile((string,string,string))": FunctionFragment;
    "defaultProfile()": FunctionFragment;
    "exists(uint256)": FunctionFragment;
    "ownerOfProfile(uint256)": FunctionFragment;
    "ownerProfiles(uint256[])": FunctionFragment;
    "profileById(uint256)": FunctionFragment;
    "setDefaultProfile(uint256)": FunctionFragment;
    "totalProfiles()": FunctionFragment;
    "updateProfileImage((uint256,string,string))": FunctionFragment;
    "validateHandle(string)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "createProfile"
      | "defaultProfile"
      | "exists"
      | "ownerOfProfile"
      | "ownerProfiles"
      | "profileById"
      | "setDefaultProfile"
      | "totalProfiles"
      | "updateProfileImage"
      | "validateHandle"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "createProfile",
    values: [DataTypes.CreateProfileDataStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "defaultProfile",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "exists",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "ownerOfProfile",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "ownerProfiles",
    values: [PromiseOrValue<BigNumberish>[]]
  ): string;
  encodeFunctionData(
    functionFragment: "profileById",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setDefaultProfile",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "totalProfiles",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "updateProfileImage",
    values: [DataTypes.UpdateProfileImageDataStruct]
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
    functionFragment: "defaultProfile",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "exists", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "ownerOfProfile",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "ownerProfiles",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "profileById",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setDefaultProfile",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalProfiles",
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

export interface IProfileNFT extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IProfileNFTInterface;

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
      createProfileData: DataTypes.CreateProfileDataStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    defaultProfile(
      overrides?: CallOverrides
    ): Promise<[DataTypes.ProfileStructOutput]>;

    exists(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    ownerOfProfile(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    ownerProfiles(
      tokenIds: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<[DataTypes.ProfileStructOutput[]]>;

    profileById(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[DataTypes.ProfileStructOutput]>;

    setDefaultProfile(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    totalProfiles(overrides?: CallOverrides): Promise<[BigNumber]>;

    updateProfileImage(
      updateProfileImageData: DataTypes.UpdateProfileImageDataStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    validateHandle(
      handle: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };

  createProfile(
    createProfileData: DataTypes.CreateProfileDataStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  defaultProfile(
    overrides?: CallOverrides
  ): Promise<DataTypes.ProfileStructOutput>;

  exists(
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  ownerOfProfile(
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  ownerProfiles(
    tokenIds: PromiseOrValue<BigNumberish>[],
    overrides?: CallOverrides
  ): Promise<DataTypes.ProfileStructOutput[]>;

  profileById(
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<DataTypes.ProfileStructOutput>;

  setDefaultProfile(
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  totalProfiles(overrides?: CallOverrides): Promise<BigNumber>;

  updateProfileImage(
    updateProfileImageData: DataTypes.UpdateProfileImageDataStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  validateHandle(
    handle: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    createProfile(
      createProfileData: DataTypes.CreateProfileDataStruct,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    defaultProfile(
      overrides?: CallOverrides
    ): Promise<DataTypes.ProfileStructOutput>;

    exists(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    ownerOfProfile(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    ownerProfiles(
      tokenIds: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<DataTypes.ProfileStructOutput[]>;

    profileById(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<DataTypes.ProfileStructOutput>;

    setDefaultProfile(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    totalProfiles(overrides?: CallOverrides): Promise<BigNumber>;

    updateProfileImage(
      updateProfileImageData: DataTypes.UpdateProfileImageDataStruct,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    validateHandle(
      handle: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {};

  estimateGas: {
    createProfile(
      createProfileData: DataTypes.CreateProfileDataStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    defaultProfile(overrides?: CallOverrides): Promise<BigNumber>;

    exists(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    ownerOfProfile(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    ownerProfiles(
      tokenIds: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    profileById(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setDefaultProfile(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    totalProfiles(overrides?: CallOverrides): Promise<BigNumber>;

    updateProfileImage(
      updateProfileImageData: DataTypes.UpdateProfileImageDataStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    validateHandle(
      handle: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    createProfile(
      createProfileData: DataTypes.CreateProfileDataStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    defaultProfile(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    exists(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    ownerOfProfile(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    ownerProfiles(
      tokenIds: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    profileById(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setDefaultProfile(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    totalProfiles(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    updateProfileImage(
      updateProfileImageData: DataTypes.UpdateProfileImageDataStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    validateHandle(
      handle: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
