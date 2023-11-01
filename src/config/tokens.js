import { CCD_DECIMALS } from "./main";

/**
 * @typedef TokenDataImage
 * @type {Object}
 * @property {string} url - image url
 */

/**
 * @typedef TokenData
 * @type {Object}
 * @property {string} id Unique token data id
 * @property {string} symbol Token symbol
 * @property {Object} images Images list
 * @property {TokenDataImage} images.thumbnail Thumbnail image
 * @property {TokenDataImage} images.display Display image
 * @property {TokenDataImage} images.artifact Artifact image
 * @property {Object} [address] Token Contract Address.
 * @property  {number} address.index Token Contract Address index
 * @property  {number} address.subindex Token Contract Address subindex
 * @property {string} [tokenId] Token id
 * @property {number} decimals Token decimals
 */

/**
 * CCD token data
 *
 * @type {TokenData}
 */
export const CCD_DATA = {
  id: "CCD",
  symbol: "CCD",
  decimals: CCD_DECIMALS,
  images: {
    thumbnail: {
      url: "/assets/images/tokens/ccd.png",
    },
    display: {
      url: "/assets/images/tokens/ccd.png",
    },
    artifact: {
      url: "/assets/images/tokens/ccd.png",
    },
  },
};

/**
 * LP token data
 *
 * @type {TokenData}
 */
export const LP_DATA = {
  id: "LP",
  symbol: "LP",
  decimals: CCD_DECIMALS,
  images: {
    thumbnail: {
      url: "/assets/images/tokens/ccd.png",
    },
    display: {
      url: "/assets/images/tokens/ccd.png",
    },
    artifact: {
      url: "/assets/images/tokens/ccd.png",
    },
  },
};
