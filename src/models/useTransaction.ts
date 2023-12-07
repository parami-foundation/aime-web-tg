import { GetExtrinsic } from "@/services/api";
import { Resp } from "@/types";
import { useState } from "react";
import { useModel } from "@umijs/max";

export default () => {
  const { accessToken } = useModel("useAccess");

  const [extrinsic, setExtrinsic] = useState<Resp.Extrinsic[]>([]);

  const getExtrinsic = async () => {
    if (!accessToken) return;
    const { response, data } = await GetExtrinsic(accessToken);
    if (response?.status === 200) {
      setExtrinsic(data);
    }
  };

  return {
    extrinsic,
    getExtrinsic,
  };
};