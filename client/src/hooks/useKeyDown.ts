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

    function updateKeyUp(e: KeyboardEvent) {
      if (e.key === keyDown.key) {
        setKeyDown({
          key: "",
          timeStamp: e.timeStamp,
        });
      }
    }

    window.addEventListener("keydown", updateKeyDown);
    window.addEventListener("keyup", updateKeyUp);
    return () => {
      window.removeEventListener("keydown", updateKeyDown);
      window.removeEventListener("keyup", updateKeyUp);
    }
  }, []);

  return keyDown;
}