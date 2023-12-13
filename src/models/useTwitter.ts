import { Resp } from "@/types";
import { useEffect, useState } from "react";

export default () => {
  const [twitterLoginMethod, setTwitterLoginMethod] = useState<Resp.LoginMethod>({});
  const [twitterOauthModalVisible, setTwitterOauthModalVisible] =
    useState<boolean>(false);
  const [twitterBinded, setTwitterBinded] = useState<boolean>(true);

  return {
    twitterOauthModalVisible,
    setTwitterOauthModalVisible,
    twitterLoginMethod,
    setTwitterLoginMethod,
    twitterBinded,
    setTwitterBinded,
  }
};