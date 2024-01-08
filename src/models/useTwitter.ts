import { Resp } from "@/types";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { useModel } from "@umijs/max";
import { BindThirdParty } from "@/services/api";
import { API_CONFIG } from "@/constants/global";
import { message } from "antd";

export default () => {
  const { accessToken } = useModel("useAccess");

  const [twitterOauthModalVisible, setTwitterOauthModalVisible] =
    useState<boolean>(false);
  const [twitterBinded, setTwitterBinded] = useState<boolean>(false);
  const [twitterState, setTwitterState] = useState<string | null>(null);;
  const [twitterCode, setTwitterCode] = useState<string | null>(null);
  const [twitterCodeVerifier, setTwitterCodeVerifier] = useState<string | null>(null);

  const search = queryString.parse(window.location.search);

  useEffect(() => {
    ; (async () => {
      if (!!search?.action && search?.action === "connectTwitter" && !!accessToken) {
        if (!!search?.state && !!search?.code) {
          setTwitterState(search?.state as string);
          setTwitterCode(search?.code as string);
          setTwitterCodeVerifier(search?.code_verifier as string);

          const { response, data } = await BindThirdParty({
            grant_type: API_CONFIG.grant_type,
            subject_token: `code=${search?.code}&state=${search?.state}&code_verifier=${search?.code_verifier}`,
            subject_issuer: "twitter-web",
          }, accessToken);

          if (response.status === 200) {
            setTwitterBinded(true);
          } else {
            message.error(data?.message || "Twitter bind failed.");
          }
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
    twitterCodeVerifier,
  }
};