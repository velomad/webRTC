import React, { useEffect, useRef, useState } from "react";

const useTimer = () => {
  const sec = useRef(0);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      if (sec.current >= 59) {
        setMinutes((prevMins) => prevMins + 1);
        sec.current = 0;
        setSeconds(0);
      } else {
        setSeconds((sec) => sec + 1);
        sec.current += 1;
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return { minutes, seconds };
};

export default useTimer;
