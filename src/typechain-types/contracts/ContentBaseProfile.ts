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
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export declare namespace DataTypes {
  export type CreateProfileParamsStruct = {
    handle: PromiseOrValue<string>;
    imageURI: PromiseOrValue<string>;
  };

  export type CreateProfileParamsStructOutput = [string, string] & {
    handle: string;
    imageURI: string;
  };

  export type ProfileStruct = {
    profileId: PromiseOrValue<BigNumberish>;
    isDefault: PromiseOrValue<boolean>;
    owner: PromiseOrValue<string>;
    handle: PromiseOrValue<string>;
    imageURI: PromiseOrValue<string>;
  };

  export type ProfileStructOutput = [
    BigNumber,
    boolean,
    string,
    string,
    string
  ] & {
    profileId: BigNumber;
    isDefault: boolean;
    owner: string;
    handle: string;
    imageURI: string;
  };

  export type UpdateProfileImageParamsStruct = {
    profileId: PromiseOrValue<BigNumberish>;
    imageURI: PromiseOrValue<string>;
    tokenURI: PromiseOrValue<string>;
  };

  export type UpdateProfileImageParamsStructOutput = [
    BigNumber,
    string,
    string
  ] & { profileId: BigNumber; imageURI: string; tokenURI: string };
}

export interface ContentBaseProfileInterface extends utils.Interface {
  functions: {
    "createProfile(string,(string,string))": FunctionFragment;
    "fetchProfilesByAddress(address)": FunctionFragment;
    "setDefaultProfile(uint256)": FunctionFragment;
    "updateProfileImage((uint256,string,string))": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "createProfile"
      | "fetchProfilesByAddress"
      | "setDefaultProfile"
      | "updateProfileImage"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "createProfile",
    values: [PromiseOrValue<string>, DataTypes.CreateProfileParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "fetchProfilesByAddress",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setDefaultProfile",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "updateProfileImage",
    values: [DataTypes.UpdateProfileImageParamsStruct]
  ): string;

  decodeFunctionResult(
    functionFragment: "createProfile",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "fetchProfilesByAddress",
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

  events: {
    "DefaultProfileUpdated(uint256,address)": EventFragment;
    "ProfileCreated(uint256,bool,address)": EventFragment;
    "ProfileImageUpdated(uint256,string,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "DefaultProfileUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ProfileCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ProfileImageUpdated"): EventFragment;
}

export interface DefaultProfileUpdatedEventObject {
  tokenId: BigNumber;
  owner: string;
}
export type DefaultProfileUpdatedEvent = TypedEvent<
  [BigNumber, string],
  DefaultProfileUpdatedEventObject
>;

export type DefaultProfileUpdatedEventFilter =
  TypedEventFilter<DefaultProfileUpdatedEvent>;

export interface ProfileCreatedEventObject {
  tokenId: BigNumber;
  isDefault: boolean;
  owner: string;
}
export type ProfileCreatedEvent = TypedEvent<
  [BigNumber, boolean, string],
  ProfileCreatedEventObject
>;

export type ProfileCreatedEventFilter = TypedEventFilter<ProfileCreatedEvent>;

export interface ProfileImageUpdatedEventObject {
  tokenId: BigNumber;
  imageURI: string;
  owner: string;
}
export type ProfileImageUpdatedEvent = TypedEvent<
  [BigNumber, string, string],
  ProfileImageUpdatedEventObject
>;

export type ProfileImageUpdatedEventFilter =
  TypedEventFilter<ProfileImageUpdatedEvent>;

export interface ContentBaseProfile extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ContentBaseProfileInterface;

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
      tokenURI: PromiseOrValue<string>,
      createProfileParams: DataTypes.CreateProfileParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    fetchProfilesByAddress(
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[DataTypes.ProfileStructOutput[]]>;

    setDefaultProfile(
      profileId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateProfileImage(
      updateProfileImageParams: DataTypes.UpdateProfileImageParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  createProfile(
    tokenURI: PromiseOrValue<string>,
    createProfileParams: DataTypes.CreateProfileParamsStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  fetchProfilesByAddress(
    owner: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<DataTypes.ProfileStructOutput[]>;

  setDefaultProfile(
    profileId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateProfileImage(
    updateProfileImageParams: DataTypes.UpdateProfileImageParamsStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    createProfile(
      tokenURI: PromiseOrValue<string>,
      createProfileParams: DataTypes.CreateProfileParamsStruct,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    fetchProfilesByAddress(
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<DataTypes.ProfileStructOutput[]>;

    setDefaultProfile(
      profileId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    updateProfileImage(
      updateProfileImageParams: DataTypes.UpdateProfileImageParamsStruct,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {
    "DefaultProfileUpdated(uint256,address)"(
      tokenId?: null,
      owner?: null
    ): DefaultProfileUpdatedEventFilter;
    DefaultProfileUpdated(
      tokenId?: null,
      owner?: null
    ): DefaultProfileUpdatedEventFilter;

    "ProfileCreated(uint256,bool,address)"(
      tokenId?: null,
      isDefault?: null,
      owner?: null
    ): ProfileCreatedEventFilter;
    ProfileCreated(
      tokenId?: null,
      isDefault?: null,
      owner?: null
    ): ProfileCreatedEventFilter;

    "ProfileImageUpdated(uint256,string,address)"(
      tokenId?: null,
      imageURI?: null,
      owner?: null
    ): ProfileImageUpdatedEventFilter;
    ProfileImageUpdated(
      tokenId?: null,
      imageURI?: null,
      owner?: null
    ): ProfileImageUpdatedEventFilter;
  };

  estimateGas: {
    createProfile(
      tokenURI: PromiseOrValue<string>,
      createProfileParams: DataTypes.CreateProfileParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    fetchProfilesByAddress(
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setDefaultProfile(
      profileId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateProfileImage(
      updateProfileImageParams: DataTypes.UpdateProfileImageParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    createProfile(
      tokenURI: PromiseOrValue<string>,
      createProfileParams: DataTypes.CreateProfileParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    fetchProfilesByAddress(
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setDefaultProfile(
      profileId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateProfileImage(
      updateProfileImageParams: DataTypes.UpdateProfileImageParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
