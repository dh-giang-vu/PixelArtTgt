import { useEffect, useRef, useState } from "react";

export default function useKeyDown() {
  const [keyDown, setKeyDown] = useState({
    key: "",
    timeStamp: 0
  });

  const keyDownRef = useRef(keyDown);

  useEffect(() => {
    keyDownRef.current = keyDown;
  }, [keyDown]);

  useEffect(() => {
    function updateKeyDown(e: KeyboardEvent) {
      setKeyDown({
        key: e.key,
        timeStamp: e.timeStamp,
      });
    }

    function updateKeyUp(e: KeyboardEvent) {
      if (e.key === keyDownRef.current.key) {
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