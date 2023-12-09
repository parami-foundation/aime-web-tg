import { extend } from "umi-request";
import { Resp, Req } from "@/types";
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
      ? "/proxy/api/v1/wallet/"
      : `${API_CONFIG.scheme}://${API_CONFIG.host}/api/v1/wallet/`,
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
      ? `/proxy/api/v1/wallet/${nonce}`
      : `${API_CONFIG.scheme}://${API_CONFIG.host}/api/v1/wallet/${nonce}`,
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

export async function GetProfile(
  accessToken: string,
  options?: { [key: string]: any }
) {
  return request<Resp.Profile>(
    DEBUG
      ? "/proxy/api/v1/profile"
      : `${API_CONFIG.scheme}://${API_CONFIG.host}/api/v1/profile`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      ...(options || {}),
      getResponse: true,
    }
  );
}

export async function GetWallet(
  accessToken: string,
  options?: { [key: string]: any }
) {
  return request<Resp.Wallet[]>(
    DEBUG
      ? "/proxy/api/v1/wallet"
      : `${API_CONFIG.scheme}://${API_CONFIG.host}/api/v1/wallet`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      ...(options || {}),
      getResponse: true,
    }
  );
}

export async function GetAsset(
  accessToken: string,
  options?: { [key: string]: any }
) {
  return request<Resp.Asset[]>(
    DEBUG
      ? "/proxy/api/v1/asset"
      : `${API_CONFIG.scheme}://${API_CONFIG.host}/api/v1/asset`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      ...(options || {}),
      getResponse: true,
    }
  );
}

export async function GetExtrinsic(
  accessToken: string,
  options?: { [key: string]: any }
) {
  return request<Resp.Extrinsic[]>(
    DEBUG
      ? "/proxy/api/v1/extrinsic"
      : `${API_CONFIG.scheme}://${API_CONFIG.host}/api/v1/extrinsic`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      ...(options || {}),
      getResponse: true,
    }
  );
}

export async function CreateSession(
  data: Req.CreateSession,
  accessToken: string,
  options?: { [key: string]: any }
) {
  return request<Resp.Session>(
    DEBUG
      ? "/proxy/api/v1/session"
      : `${API_CONFIG.scheme}://${API_CONFIG.host}/api/v1/session`,
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

export async function GetSession(
  accessToken: string,
  options?: { [key: string]: any }
) {
  return request<Resp.Session[]>(
    DEBUG
      ? "/proxy/api/v1/session"
      : `${API_CONFIG.scheme}://${API_CONFIG.host}/api/v1/session`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      ...(options || {}),
      getResponse: true,
    }
  );
}

export async function GetSessionByCharacterId(
  characterId: string,
  accessToken: string,
  options?: { [key: string]: any }
) {
  return request<Resp.Session[]>(
    DEBUG
      ? `/proxy/api/v1/session/${characterId}`
      : `${API_CONFIG.scheme}://${API_CONFIG.host}/api/v1/session?character_id=${characterId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      ...(options || {}),
      getResponse: true,
    }
  );
}

export async function GetChatHistory(
  accessToken: string,
  session_id: string,
  options?: { [key: string]: any }
) {
  return request<Resp.ChatHistory[]>(
    DEBUG
      ? `/proxy/api/v1/session/${session_id}/message`
      : `${API_CONFIG.scheme}://${API_CONFIG.host}/api/v1/session/${session_id}/message`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
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
      ? "/proxy/api/v1/transaction"
      : `${API_CONFIG.scheme}://${API_CONFIG.host}/api/v1/transaction/`,
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
