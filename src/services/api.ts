import { extend } from "umi-request";
import { Resp, Req } from "@/types";
import { API_CONFIG } from "@/constants/global";
import { v4 as uuidv4 } from 'uuid';

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
    `${API_CONFIG.scheme}://${API_CONFIG.host}/oauth2/token`,
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

export async function GetLoginMethod(
  accessToken: string,
  options?: { [key: string]: any }
) {
  return request<Resp.LoginMethod[]>(
    `${API_CONFIG.scheme}://${API_CONFIG.host}/api/v1/login`,
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

export async function BindWalletNonce(
  data: Req.BindWalletNonce,
  accessToken: string,
  options?: { [key: string]: any }
) {
  return request<Resp.BindWalletNonce>(
    `${API_CONFIG.scheme}://${API_CONFIG.host}/api/v1/wallet/`,
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
    `${API_CONFIG.scheme}://${API_CONFIG.host}/api/v1/wallet/${nonce}`,
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
    `${API_CONFIG.scheme}://${API_CONFIG.host}/api/v1/profile`,
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
    `${API_CONFIG.scheme}://${API_CONFIG.host}/api/v1/wallet`,
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
    `${API_CONFIG.scheme}://${API_CONFIG.host}/api/v1/asset`,
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
    `${API_CONFIG.scheme}://${API_CONFIG.host}/api/v1/extrinsic`,
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
    `${API_CONFIG.scheme}://${API_CONFIG.host}/api/v1/session`,
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
    `${API_CONFIG.scheme}://${API_CONFIG.host}/api/v1/session`,
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
    `${API_CONFIG.scheme}://${API_CONFIG.host}/api/v1/session?character_id=${characterId}`,
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
    `${API_CONFIG.scheme}://${API_CONFIG.host}/api/v1/session/${session_id}/message`,
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
    `${API_CONFIG.scheme}://${API_CONFIG.host}/api/v1/transaction/`,
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

export async function ShareAIME(
  data: Req.ShareAIME,
  accessToken: string,
  options?: { [key: string]: any }
) {
  return request(
    `${API_CONFIG.scheme}://${API_CONFIG.host}/api/v1/share`,
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

export async function TranslationTTS(
  data: Blob,
  accessToken: string,
  options?: { [key: string]: any }
) {
  const formData = new FormData();
  formData.append('file', data, `${uuidv4()}.wav}`);

  return request<Resp.TrainVoice>(
    `${API_CONFIG.scheme}://${API_CONFIG.host}/api/v1/translation-tts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: formData,
      requestType: 'form',
      ...(options || {}),
      getResponse: true,
    }
  );
}

export async function TrainVoice(
  data: Blob,
  accessToken: string,
  options?: { [key: string]: any }
) {
  const formData = new FormData();
  formData.append('file', data);
  return request(
    `${API_CONFIG.scheme}://${API_CONFIG.host}/train_voice`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: formData,
      requestType: 'form',
      ...(options || {}),
      getResponse: true,
    }
  )
}

export async function TrainCharacterBasic(
  data: Req.TrainCharacterBasic,
  accessToken: string,
  options?: { [key: string]: any }
) {
  return request(
    `${API_CONFIG.scheme}://${API_CONFIG.host}/train_character_basic`,
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
  )
}
