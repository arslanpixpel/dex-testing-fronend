import axios from "axios";

// Constants
import { JS_NODE_URL } from "../config";

export const pixpelRequest = axios.create({
  responseType: "json",
  baseURL: `${JS_NODE_URL}/api/v1`,
});
