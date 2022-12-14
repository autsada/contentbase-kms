/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IContentBaseFollowV1,
  IContentBaseFollowV1Interface,
} from "../../../contracts/profile/IContentBaseFollowV1";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "followerId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "followeeId",
        type: "uint256",
      },
    ],
    name: "follow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "profileId",
        type: "uint256",
      },
    ],
    name: "getFollowCounts",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getProfileContract",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newContractAddress",
        type: "address",
      },
    ],
    name: "updateProfileContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IContentBaseFollowV1__factory {
  static readonly abi = _abi;
  static createInterface(): IContentBaseFollowV1Interface {
    return new utils.Interface(_abi) as IContentBaseFollowV1Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IContentBaseFollowV1 {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as IContentBaseFollowV1;
  }
}
