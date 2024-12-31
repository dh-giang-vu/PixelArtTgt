import { useEffect, useState } from "react";

export default function useKeyDown() {
  const [keyDown, setKeyDown] = useState({
    key: "",
    timeStamp: 0
  });

  useEffect(() => {
    function updateKeyDown(e: KeyboardEvent) {
      setKeyDown({
        key: e.key,
        timeStamp: e.timeStamp,
      });
    }

    window.addEventListener("keydown", updateKeyDown);
    return () => {
      window.removeEventListener("keydown", updateKeyDown);
    }
  }, []);

  return keyDown;
}