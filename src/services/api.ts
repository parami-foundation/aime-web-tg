import { extend } from "umi-request";
import { Resp, Req } from "@/services/typing";
import { API_CONFIG, DEBUG } from "@/constants/global";

const errorHandler = (error: any) => {
  const { response = {}, data = {} } = error;
  return {
    response,
    data,
  } as Resp.Body;
};

export const request = extend({
  errorHandler,
  credentials: "same-origin",
});

export async function OauthTelegram(
  data: Req.OauthTelegram,
  options?: { [key: string]: any }
) {
  return request<Resp.OauthTelegram>(
    DEBUG
      ? "/proxy/oauth2/token"
      : `${API_CONFIG.scheme}://${API_CONFIG.host}/oauth2/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
      ...(options || {}),
      getResponse: true,
    }
  );
}

export async function BindWalletNonce(
  data: Req.BindWalletNonce,
  accessToken: string,
  options?: { [key: string]: any }
) {
  return request<Resp.BindWalletNonce>(
    DEBUG
      ? "/proxy/api/wallet/"
      : `${API_CONFIG.scheme}://${API_CONFIG.host}/api/wallet/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: data,
      ...(options || {}),
      getResponse: true,
    }
  );
}

export async function BindWallet(
  data: Req.BindWallet,
  nonce: string,
  accessToken: string,
  options?: { [key: string]: any }
) {
  return request<Resp.Error>(
    DEBUG
      ? `/proxy/api/wallet/${nonce}`
      : `${API_CONFIG.scheme}://${API_CONFIG.host}/api/wallet/${nonce}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: data,
      ...(options || {}),
      getResponse: true,
    }
  );
}

export async function CreateTransaction(
  data: Req.CreateTransaction,
  accessToken: string,
  options?: { [key: string]: any }
) {
  return request(
    DEBUG
      ? "/proxy/api/transaction"
      : `${API_CONFIG.scheme}://${API_CONFIG.host}/api/transaction`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: data,
      ...(options || {}),
      getResponse: true,
    }
  );
}
