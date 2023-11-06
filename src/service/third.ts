import { request } from "./api";
import { Resp, Req } from "@/service/typing.d";

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
