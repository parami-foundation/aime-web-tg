import { IPFS_CONFIG } from "@/constants/global";
import { request } from "./api";
import { Resp, Req } from "@/types";

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

export async function UploadIPFS(
  data: Blob,
  options?: { [key: string]: any }
) {
  const formData = new FormData();
  formData.append("file", data);

  return request<Resp.UploadIPFS>(
    `https://${IPFS_CONFIG.host}${IPFS_CONFIG.upload}`,
    {
      method: "POST",
      data: formData,
      ...(options || {}),
      requestType: "form",
      getResponse: true,
    }
  );
}
