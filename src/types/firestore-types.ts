/**
 * @param id {string} - a document id
 * @param key {string} - a blockchain wallet key (encrypted)
 * @param address {string} - a blockchain wallet address
 */
export type Wallet = {
  id: string
  key: string
  address: string
}

/**
 * @param id - a document id
 * @param address - a blockchain wallet address
 */
export type Account = {
  id: string
  address: string
  type: "traditional" | "wallet"
  createdAt: string
  updatedAt?: string | null
}

/**
 * Enum for contract's role.
 */
export enum Role {
  DEFAULT = "DEFAULT_ADMIN_ROLE",
  ADMIN = "ADMIN_ROLE",
  UPGRADER = "UPGRADER_ROLE",
}

export type CheckRoleParams = {
  role: Role
  address: string
  key: string
}

/**
 * Input data required for creating a Profile NFT.
 * @param key {string} - wallet's key
 * @param data.handle {string} - a handle of the profile
 * @param data.imageURI {string} - a profile image uri
 */
export type CreateProfileInput = {
  key: string
  data: {
    handle: string
    imageURI: string
  }
}

/**
 * Input data required for creating update Profile image.
 * @param key {string} - wallet's key
 * @param data.tokenId {number} - an id of a Profile NFT
 * @param data.imageURI {string} - a profile image uri
 */
export type UpdateProfileImageInput = {
  key: string
  data: {
    tokenId: number
    imageURI: string
  }
}

/**
 * @param tokenId {number} - a token id
 * @param owner {string} - a blockchain wallet address that owns the token
 * @param handle {string} - a unique name of the profile
 * @param imageURI {string} - a profile's image uri (can be empty string)
 * @param following {number} - total number of following of the profile
 * @param followers {number} - total number of followers of the profile
 */
export type ProfileToken = {
  tokenId: number
  owner: string
  handle: string
  imageURI: string
  following: number
  followers: number
}

/**
 * See ProfileToken
 * @param id {string} - a database id
 * @param uid {string} - an owner auth uid
 * @param displayedHandle {string} - original unformatted handle, use dis to display on the UI
 * @createdAt {string}
 * @updatedAt {string}
 */
export type ProfileDoc = ProfileToken & {
  id: string
  uid: string
  displayedHandle: string
  createdAt: string
  updatedAt?: string | null
}

/**
 * Category of a publish token
 */
export enum Category {
  Empty = "Empty",
  Music = "Music",
  Movies = "Movies",
  Entertainment = "Entertainment",
  Sports = "Sports",
  Food = "Food",
  Travel = "Travel",
  Gaming = "Gaming",
  News = "News",
  Animals = "Animals",
  Education = "Education",
  Science = "Science",
  Technology = "Technology",
  Programming = "Programming",
  LifeStyle = "LifeStyle",
  Vehicles = "Vehicles",
  Children = "Children",
  Women = "Women",
  Men = "Men",
  Other = "Other",
  NotExist = "NotExist",
}

/**
 * Input data required to create a Publish NFT.
 * @param key - a wallet's key
 * @param data.creatorId - a token id of the creator's profile
 * @param data.imageURI - a thumbnail image uri of the publish
 * @param data.contentURI - a content uri of the publish
 * @param data.metadataURI - a metadata file uri of the publish
 * @param data.title - a publish's title
 * @param data.description - a publish's description
 * @param data.primaryCategory - a publish's primaryCategory
 * @param data.secondaryCategory - a publish's secondaryCategory
 * @param data.tertiaryCategory - a publish's tertiaryCategory
 */
export type CreatePublishInput = {
  key: string
  data: {
    creatorId: number
    imageURI: string
    contentURI: string
    metadataURI: string
    title: string
    description?: string
    primaryCategory: Category
    secondaryCategory: Category
    tertiaryCategory: Category
  }
}

/**
 * Input data required to update Publish.
 * @param key - a wallet's key
 * @param data.tokenId - a token id of the publish to be updated
 * @param data.creatorId - a token id of the creator's profile
 * @param data.imageURI - a thumbnail image uri of the publish
 * @param data.contentURI - a uri of the publish
 * @param data.metadataURI - a metadata file uri of the publish
 * @param data.title - a publish's title
 * @param data.description - a publish's description
 * @param data.primaryCategory - a publish's primaryCategory
 * @param data.secondaryCategory - a publish's secondaryCategory
 * @param data.tertiaryCategory - a publish's tertiaryCategory
 */
export type UpdatePublishInput = {
  key: string
  data: {
    tokenId: number
    creatorId: number
    imageURI?: string
    contentURI?: string
    metadataURI?: string
    title?: string
    description?: string
    primaryCategory?: Category
    secondaryCategory?: Category
    tertiaryCategory?: Category
  }
}

/**
 * @param tokenId {uint256} - a token id
 * @param owner {address} - an address that owns the token
 * @param creatorId {uint256} - a profile token id of the creator
 * @param likes {uint256} - number of likes a publish has
 * @param imageURI {string} - a publish's thumbnail image uri
 * @param contentURI {string} - a publish's content uri, tipically it's a uri point to a video content
 * @param metadataURI {string} - a uri point to the publish's metadata json file that contain all information about a publish.
 *
 * @dev Metadata Guild: the metadata json object must have these below fields, additional fields can be added.
 * {
 *      name {string}: "A title of the publish",
 *      description {string}: "A description of the publish",
 *      image {string}: "A publish's thumbnail image, prefer ipfs storage"
 *      properties: {
 *          content: "A publish's content uri, prefer ipfs storage",
 *          primaryCategory {enum}: "See Category enum above - must NOT Empty",
 *          secondaryCategory {enum}: "See Category enum above - can be Empty",
 *          tertiaryCategory {enum}: "See Category enum above - can be Empty",
 *      }
 * }
 */
export type PublishToken = {
  tokenId: number
  owner: string
  creatorId: number
  likes: number
  imageURI: string
  contentURI: string
  metadataURI: string
}

/**
 * See PublishToken
 * @param id {string} - a database id
 * @param uid {string} - an owner auth uid
 * @param title {string}
 * @param description {string}
 * @param primaryCategory {enum}
 * @param secondaryCategory {enum}
 * @param tertiaryCategory {enum}
 * @createdAt {string}
 * @updatedAt {string}
 */
export type PublishDoc = PublishToken & {
  id: string
  uid: string
  title: string
  description: string
  primaryCategory: Category
  secondaryCategory: Category
  tertiaryCategory: Category
  createdAt: string
  updatedAt?: string | null
}

/**
 * Input data required for creating a Follow NFT.
 * @param key - a wallet's key
 * @param data.follwerId - a profile id of the follwer
 * @param data.follweeId - a profile id of the follwee
 */
export type CreateFollowInput = {
  key: string
  data: {
    followerId: number
    followeeId: number
  }
}

/**
 * @param tokenId {uint256} - a token id
 * @param owner {address} - an address that owns the token.
 * @param followerId {uint256} - a Profile NFT id that follows followeeId.
 * @param followeeId {uint256} - a Profile NFT id that is being followed by followerId.
 */
export type FollowToken = {
  tokenId: number
  owner: string
  followeeId: number
  followerId: number
}

// /**
//  * See FollowToken
//  * @param id {string} - a database id
//  * @param uid {string} - an owner auth uid
//  * @createdAt {string}
//  * @updatedAt {string}
//  */
// export type FollowDoc = FollowToken & {
//   id: string
//   uid: string
//   createdAt: string
//   updatedAt?: string | null
// }

/**
 * Input data required for creating a Like NFT.
 * @param key - a wallet's key
 * @param data.profileId - a profile id of the caller
 * @param data.publishId - a publish id that the caller likes
 */
export interface CreateLikeInput {
  key: string
  data: {
    profileId: number
    publishId: number
  }
}

/**
 * @param tokenId {uint256} - a token id
 * @param owner {address} - an address that owns the token.
 * @param profileId {uint256} - a Profile NFT id that performs a like.
 * @param publishId {uint256} - a Publish NFT id that is being liked.
 */
export type LikeToken = {
  tokenId: number
  owner: string
  profileId: number
  publishId: number
}

// /**
//  * See LikeToken
//  * @param id {string} - a database id
//  * @param uid {string} - an owner auth uid
//  * @createdAt {string}
//  * @updatedAt {string}
//  */
// export type LikeDoc = LikeToken & {
//   id: string
//   uid: string
//   createdAt: string
//   updatedAt?: string | null
// }
