import { useEffect, useState } from "react";

export const useAsyncMemo = (getResult, handleError, deps) => {
  const [result, setResult] = useState();
  useEffect(() => {
    getResult().then(setResult).catch(handleError);
  }, deps);
  return result;
};
