import { CCD_DECIMALS } from "./main";

/**
 * @typedef TokenData
 * @type {Object}
 * @property {number} id Token id (for internal purposes only)
 * @property {string} title Token title
 * @property {string} url Url of token image
 * @property {Object} [address] Token Contract Address.
 * @property  {number} address.index Token Contract Address index
 * @property  {number} address.subindex Token Contract Address subindex
 * @property {string} [tokenId] Token id
 * @property {number} decimals Token decimals
 */

/**
 * Predefined list of tokens
 *
 * @type {Array.<TokenData>}
 */
export const TOKEN_LIST = [
  {
    id: 1,
    title: "CCD",
    url: "/assets/images/tokens/ccd.png",
    decimals: CCD_DECIMALS,
  },
  {
    id: 2,
    title: "TKN1",
    url: "/assets/images/tokens/pixp.png",
    address: {
      index: 3677,
      subindex: 0,
    },
    tokenId: "00",
    decimals: 6,
  },
  {
    id: 3,
    title: "TKN2",
    url: "/assets/images/tokens/pixp.png",
    address: {
      index: 3678,
      subindex: 0,
    },
    tokenId: "00",
    decimals: 6,
    style: {
      filter: "hue-rotate(180deg)",
    },
  },
  {
    id: 4,
    title: "TKN3",
    url: "/assets/images/tokens/pixp.png",
    address: {
      index: 3829,
      subindex: 0,
    },
    tokenId: "00",
    decimals: 6,
    style: {
      filter: "hue-rotate(240deg)",
    },
  },
  {
    id: 5,
    title: "TKN4",
    url: "/assets/images/tokens/pixp.png",
    address: {
      index: 3830,
      subindex: 0,
    },
    tokenId: "00",
    decimals: 6,
    style: {
      filter: "hue-rotate(300deg)",
    },
  },
];
