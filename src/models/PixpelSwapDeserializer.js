import { deserializeReceiveReturnValue } from "@concordium/web-sdk";
import leb128 from "leb128";

// Utils
import { PIXPEL_CONTRACT_METHODS, PIXPEL_SWAP_CONTRACT_INFO } from "../config";

// Common
import { snakeToCamelCase } from "../utils/common";

export class PixpelSwapDeserializer {
  constructor(buffer) {
    this.buffer = buffer;
  }

  readExchanges() {
    const deserializedValue = deserializeReceiveReturnValue(
      this.buffer,
      PIXPEL_SWAP_CONTRACT_INFO.schemaBuffer,
      PIXPEL_SWAP_CONTRACT_INFO.contractName,
      PIXPEL_CONTRACT_METHODS.getExchanges,
    );
    const exchanges = deserializedValue.exchanges;

    return exchanges?.map(exchangeData =>
      Object.entries(exchangeData).reduce((acc, [key, value]) => {
        acc[snakeToCamelCase(key)] = value;

        return acc;
      }, {}),
    );
  }

  readOperatorOf() {
    const deserializedValue = deserializeReceiveReturnValue(
      this.buffer,
      PIXPEL_SWAP_CONTRACT_INFO.schemaBuffer,
      PIXPEL_SWAP_CONTRACT_INFO.contractName,
      PIXPEL_CONTRACT_METHODS.operatorOf,
    );

    return deserializedValue[0];
  }

  readBalanceOf() {
    const slicedBuffer = this.buffer.slice(2);

    return leb128.unsigned.decode(slicedBuffer);
  }

  readTokenToCcdAmount() {
    const deserializedValue = deserializeReceiveReturnValue(
      this.buffer,
      PIXPEL_SWAP_CONTRACT_INFO.schemaBuffer,
      PIXPEL_SWAP_CONTRACT_INFO.contractName,
      PIXPEL_CONTRACT_METHODS.tokenToCcdAmount,
    );

    return deserializedValue.amount;
  }

  readCcdToTokenAmount() {
    const deserializedValue = deserializeReceiveReturnValue(
      this.buffer,
      PIXPEL_SWAP_CONTRACT_INFO.schemaBuffer,
      PIXPEL_SWAP_CONTRACT_INFO.contractName,
      PIXPEL_CONTRACT_METHODS.ccdToTokenAmount,
    );

    return deserializedValue.amount;
  }

  readTokenToTokenAmount() {
    const deserializedValue = deserializeReceiveReturnValue(
      this.buffer,
      PIXPEL_SWAP_CONTRACT_INFO.schemaBuffer,
      PIXPEL_SWAP_CONTRACT_INFO.contractName,
      PIXPEL_CONTRACT_METHODS.tokenToTokenAmount,
    );

    return deserializedValue.amount;
  }
}
