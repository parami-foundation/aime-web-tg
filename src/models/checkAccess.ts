import { useState } from "react";

export default () => {
  const [binded, setBinded] = useState<boolean>(true);
  const [signature, setSignature] = useState<string>("");
  const [bindedTwitter, setBindedTwitter] = useState<boolean>(true);

  return {
    binded,
    signature,
    bindedTwitter,
    setBinded,
    setSignature,
    setBindedTwitter,
  };
};
