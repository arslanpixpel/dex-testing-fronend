import { useCallback, useEffect } from "react";

export const useOutsideClick = (ref, callback) => {
  const handleClick = useCallback(
    e => {
      if (ref.current && !ref.current.contains(e.target)) {
        callback(ref.current, e.target);
      }
    },
    [ref, callback],
  );

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [handleClick]);
};
