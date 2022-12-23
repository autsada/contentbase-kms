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
 * @param data.originalHandle {string} - an unformatted handle
 */
export type CreateProfileInput = {
  key: string
  data: {
    handle: string
    imageURI: string
    originalHandle: string
  }
}

/**
 * Input data required for creating update Profile image.
 * @param key {string} - wallet's key
 * @param data.tokenId {number} - a profile token id to be updated
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
 * @param tokenId {number} - a token id
 * @param owner {string} - a blockchain wallet address that owns the token
 * @param handle {string} - a unique name of the profile
 * @param imageURI {string} - a profile's image uri (can be empty string)
 */
export type ProfileToken = {
  tokenId: number
  owner: string
  handle: string
  imageURI: string
}

/**
 * Category of the publish struct
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
 * Pubish's kind
 */
export enum PublishKind {
  Video = "Video",
  Short = "Short",
  Audio = "Audio",
  Blog = "Blog",
  Post = "Post",
}

/**
 * Input data required to create a Publish NFT.
 * @param key - a wallet's key
 * @param data.creatorId - a profile id that user uses to create a publish
 * @param data.contentURI - a content uri of the publish
 * @param data.contentRef - a path to the content that stored on the cloud or ipfs
 * @param data.title - a publish's title
 * @param data.description - a publish's description
 * @param data.primaryCategory - a publish's primaryCategory
 * @param data.secondaryCategory - a publish's secondaryCategory
 * @param data.tertiaryCategory - a publish's tertiaryCategory
 * @param data.kind - a publish's kind
 */
export type CreatePublishInput = {
  key: string
  data: {
    creatorId: number
    contentURI: string
    contentRef: string
    title: string
    description: string
    primaryCategory: Category
    secondaryCategory: Category
    tertiaryCategory: Category
    kind: PublishKind
  }
}

/**
 * Input data required to update Publish.
 * @param key - a wallet's key
 * @param data.tokenId - a token id of the publish to be updated
 * @param data.creatorId - a creator profile id
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
    title: string
    description: string
    primaryCategory: Category
    secondaryCategory: Category
    tertiaryCategory: Category
  }
}

/**
 * @param tokenId {uint256} - a token id
 * @param owner {address} - an address that owns the token
 * @param creatorId {uint256} - a profile token id of the creator
 * @param contentURI {string} - a publish's content uri, tipically it's a uri point to a video content
 * ContentURI structure
 * {
 *      name: <Publish's title>,
 *      description: <Publish's description>,
 *      image: <Publish's content uri>
 *      properties: {
 *          primaryCategory: <Publish's primary category>,
 *          secondaryCategory: <Publish's secondary category>,
 *          tertiaryCategory: <Publish's tertiary category>,
 *          kind: <Publish's kind>,
 *      }
 * }
 */
export type PublishToken = {
  tokenId: number
  owner: string
  creatorId: number
  contentURI: string
}

/**
 * @param key - a wallet's key
 * @param data.publishId {number} - a publish token id
 * @param data.creatorId {number} - a profile token id that creates a comment
 * @param data.text {string} - text
 */
export type CommentInput = {
  key: string
  data: {
    parentId: number
    creatorId: number
    text: string
  }
}

/**
 * @param key - a wallet's key
 * @param data.tokenId {number} - a publish or comment token id
 * @param data.creatorId {number} - a profile token id that creates a comment
 * @param data.text {string} - text
 */
export type UpdateCommentInput = {
  key: string
  data: {
    tokenId: number
    creatorId: number
    text: string
  }
}

export enum CommentType {
  PUBLISH = "PUBLISH",
  COMMENT = "COMMENT",
}

export type CommentToken = {
  tokenId: number
  owner: string
  creatorId: number
  parentId: number
  commentType: CommentType
  text: string
}
