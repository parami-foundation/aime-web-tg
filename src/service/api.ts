import { extend } from "umi-request";
import { Resp, Req } from "@/service/typing.d";
import { API_CONFIG } from "@/constants/global";

const errorHandler = (error: any) => {
  const { response = {}, data = {} } = error;
  return {
    response,
    data,
  } as Resp.Body;
};

const request = extend({
  errorHandler,
  credentials: "same-origin",
});

export async function OauthTelegram(
  data: Req.OauthTelegram,
  options?: { [key: string]: any }
) {
  return request<Resp.OauthTelegram>(
    `${API_CONFIG.scheme}://${API_CONFIG.host}/api/oauth/telegram`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
      ...(options || {}),
    }
  );
}
