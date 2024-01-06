import { Resp } from "@/types";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { useModel } from "@umijs/max";
import { BindThirdParty } from "@/services/api";
import { API_CONFIG } from "@/constants/global";

export default () => {
  const { accessToken } = useModel("useAccess");

  const [twitterOauthModalVisible, setTwitterOauthModalVisible] =
    useState<boolean>(false);
  const [twitterBinded, setTwitterBinded] = useState<boolean>(false);
  const [twitterState, setTwitterState] = useState<string | null>(null);;
  const [twitterCode, setTwitterCode] = useState<string | null>(null);

  const search = queryString.parse(window.location.search);

  useEffect(() => {
    ; (async () => {
      if (!!search?.oauth && search?.oauth === "twitter" && !!accessToken) {
        if (!!search?.state && !!search?.code) {
          setTwitterState(search?.state as string);
          setTwitterCode(search?.code as string);

          const { response, data } = await BindThirdParty({
            grant_type: API_CONFIG.grant_type,
            subject_token: `code=${search?.code}&state=${search?.state}`,
            subject_issuer: "twitter-web",
          }, accessToken);

          console.log("BindThirdParty", response, data);
          // Fake success
          setTwitterBinded(true);
        }
      }
    })()
  }, [accessToken]);

  return {
    twitterOauthModalVisible,
    setTwitterOauthModalVisible,
    twitterBinded,
    setTwitterBinded,
    twitterCode,
    twitterState,
    setTwitterState,
  }
};