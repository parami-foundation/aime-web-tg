import { useState } from "react";

export default () => {
  const [binded, setBinded] = useState<boolean>(false);
  const [signature, setSignature] = useState<string>("");

  return {
    binded,
    signature,
    setBinded,
    setSignature,
  };
};
