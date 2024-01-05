import { Resp } from "@/types";
import queryString from "query-string";
import { useEffect, useState } from "react";

export default () => {
  const [twitterLoginMethod, setTwitterLoginMethod] = useState<Resp.LoginMethod>({});
  const [twitterOauthModalVisible, setTwitterOauthModalVisible] =
    useState<boolean>(false);
  const [twitterBinded, setTwitterBinded] = useState<boolean>(true);

  const [twitterState, setTwitterState] = useState<string | null>(null);
  const [twitterCode, setTwitterCode] = useState<string | null>(null);

  const search = queryString.parse(window.location.search);

  useEffect(() => {
    if (!!search?.oauth && search?.oauth === "twitter") {
      if (!!search?.state && !!search?.code) {
        setTwitterState(search?.state as string);
        setTwitterCode(search?.code as string);
      }
    }
  }, []);

  return {
    twitterOauthModalVisible,
    setTwitterOauthModalVisible,
    twitterLoginMethod,
    setTwitterLoginMethod,
    twitterBinded,
    setTwitterBinded,
    twitterCode,
    twitterState,
  }
};