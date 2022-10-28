/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IPublishNFT,
  IPublishNFTInterface,
} from "../../../contracts/publish/IPublishNFT";

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
            name: "imageURI",
            type: "string",
          },
          {
            internalType: "string",
            name: "contentURI",
            type: "string",
          },
          {
            internalType: "string",
            name: "metadataURI",
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
        internalType: "struct DataTypes.CreatePublishData",
        name: "createPublishData",
        type: "tuple",
      },
    ],
    name: "createPublish",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "tokenIds",
        type: "uint256[]",
      },
    ],
    name: "getPublishes",
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
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "creatorId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "likes",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "imageURI",
            type: "string",
          },
          {
            internalType: "string",
            name: "contentURI",
            type: "string",
          },
          {
            internalType: "string",
            name: "metadataURI",
            type: "string",
          },
        ],
        internalType: "struct DataTypes.Publish[]",
        name: "",
        type: "tuple[]",
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
    name: "like",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
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
    name: "ownerOfPublish",
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
        internalType: "uint256[]",
        name: "tokenIds",
        type: "uint256[]",
      },
    ],
    name: "ownerPublishes",
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
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "creatorId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "likes",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "imageURI",
            type: "string",
          },
          {
            internalType: "string",
            name: "contentURI",
            type: "string",
          },
          {
            internalType: "string",
            name: "metadataURI",
            type: "string",
          },
        ],
        internalType: "struct DataTypes.Publish[]",
        name: "",
        type: "tuple[]",
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
    name: "publishById",
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
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "creatorId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "likes",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "imageURI",
            type: "string",
          },
          {
            internalType: "string",
            name: "contentURI",
            type: "string",
          },
          {
            internalType: "string",
            name: "metadataURI",
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
    inputs: [],
    name: "publishesCount",
    outputs: [
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
    inputs: [
      {
        internalType: "address",
        name: "likeContractAddress",
        type: "address",
      },
    ],
    name: "setLikeContractAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "profileContractAddress",
        type: "address",
      },
    ],
    name: "setProfileContract",
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
    ],
    name: "unLike",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
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
            name: "imageURI",
            type: "string",
          },
          {
            internalType: "string",
            name: "contentURI",
            type: "string",
          },
          {
            internalType: "string",
            name: "metadataURI",
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
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IPublishNFT__factory {
  static readonly abi = _abi;
  static createInterface(): IPublishNFTInterface {
    return new utils.Interface(_abi) as IPublishNFTInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IPublishNFT {
    return new Contract(address, _abi, signerOrProvider) as IPublishNFT;
  }
}
