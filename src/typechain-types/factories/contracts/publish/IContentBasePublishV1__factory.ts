/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IContentBasePublishV1,
  IContentBasePublishV1Interface,
} from "../../../contracts/publish/IContentBasePublishV1";

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "creatorId",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "contentURI",
            type: "string",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "enum DataTypes.Category",
            name: "primaryCategory",
            type: "uint8",
          },
          {
            internalType: "enum DataTypes.Category",
            name: "secondaryCategory",
            type: "uint8",
          },
          {
            internalType: "enum DataTypes.Category",
            name: "tertiaryCategory",
            type: "uint8",
          },
          {
            internalType: "enum DataTypes.PublishKind",
            name: "kind",
            type: "uint8",
          },
        ],
        internalType: "struct DataTypes.CreatePublishData",
        name: "createPublishData",
        type: "tuple",
      },
    ],
    name: "createPublish",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "creatorId",
        type: "uint256",
      },
    ],
    name: "deletePublish",
    outputs: [],
    stateMutability: "nonpayable",
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
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getPublishById",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "creatorId",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "contentURI",
            type: "string",
          },
        ],
        internalType: "struct DataTypes.Publish",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "publishId",
        type: "uint256",
      },
    ],
    name: "publishExist",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "publishId",
        type: "uint256",
      },
    ],
    name: "publishOwner",
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
        name: "contractAddress",
        type: "address",
      },
    ],
    name: "updateProfileContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "creatorId",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "contentURI",
            type: "string",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "enum DataTypes.Category",
            name: "primaryCategory",
            type: "uint8",
          },
          {
            internalType: "enum DataTypes.Category",
            name: "secondaryCategory",
            type: "uint8",
          },
          {
            internalType: "enum DataTypes.Category",
            name: "tertiaryCategory",
            type: "uint8",
          },
        ],
        internalType: "struct DataTypes.UpdatePublishData",
        name: "updatePublishData",
        type: "tuple",
      },
    ],
    name: "updatePublish",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IContentBasePublishV1__factory {
  static readonly abi = _abi;
  static createInterface(): IContentBasePublishV1Interface {
    return new utils.Interface(_abi) as IContentBasePublishV1Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IContentBasePublishV1 {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as IContentBasePublishV1;
  }
}
