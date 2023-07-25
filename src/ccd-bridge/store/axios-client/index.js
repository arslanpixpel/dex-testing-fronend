import { create } from "zustand";
import axiosClientActions from "./actions";
import state from "./state";

const axiosClient = (set, get) => ({
  ...state,
  ...axiosClientActions(set, get),
});

const useAxiosClient = create(axiosClient);

export default useAxiosClient;
