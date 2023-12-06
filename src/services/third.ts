import { request } from "./api";
import { Resp, Req, WhisperApiConfig } from "@/types";

export async function GetTokenPrice(
  data: Req.GetTokenPrice,
  options?: { [key: string]: any }
) {
  return request<Resp.GetTokenPrice>(
    `https://api.coingecko.com/api/v3/simple/price?ids=${data.token}&vs_currencies=${data.currency}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
      ...(options || {}),
      getResponse: true,
    }
  );
}

export async function OpenAIWhisper(
  file: File,
  whisperConfig?: WhisperApiConfig,
  mode?: string,
  options?: { [key: string]: any }
) {
  const body = new FormData();
  body.append("file", file);
  body.append("model", mode ?? 'whisper-1');

  if (mode === "transcriptions") {
    body.append("language", whisperConfig?.language ?? 'en');
  }

  if (whisperConfig?.prompt) {
    body.append("prompt", whisperConfig.prompt);
  }

  if (whisperConfig?.response_format) {
    body.append("response_format", whisperConfig.response_format);
  }

  if (whisperConfig?.temperature) {
    body.append("temperature", whisperConfig.temperature.toString());
  }

  return request<Resp.OpenAIWhisper>(
    `https://api.openai.com/v1/audio/${mode ?? 'whisper-1'}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      data: body,
      ...(options || {}),
      requestType: 'form',
      getResponse: true,
    }
  );
}