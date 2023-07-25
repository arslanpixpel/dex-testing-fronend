import SwaggerClient from "swagger-client";
import spec from "../../api-query/__generated__/openapi.json";
import { useChainId } from "../definedChainId";
import urls from "../../config/urls";
import { addressesConfig } from "../../../utils/config";

const axiosClientActions = (set, get) => {
  return {
    getClient: async () => {
      let client = get().client;
      const chainId = useChainId.getState().chainId;
      const requestInterceptor = (request: any) => {
        const token = localStorage["profile"] && JSON.parse(localStorage["profile"])?.token;
        if (request.loadSpec && token && request?.headers) {
          request.headers["Authorization"] = `Bearer ${token}`;
        }
        return request;
      };

      const swaggerAPIs = await new SwaggerClient({
        spec,
        url: chainId === 5 ? addressesConfig[chainId].API_URL : urls.bridgeApi,
        requestInterceptor,
      });
      client = swaggerAPIs.apis.crate;
      set(state => ({ ...state, client }));
      return client;
    },
  };
};

export default axiosClientActions;
