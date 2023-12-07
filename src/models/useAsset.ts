import { GetAsset } from '@/services/api';
import { Resp } from '@/types';
import { useModel } from '@umijs/max';
import { useState } from 'react';

export default () => {
  const { accessToken } = useModel('useAccess');

  const [asset, setAsset] = useState<Resp.Asset[]>([]);

  const getAsset = async () => {
    if (!accessToken) return;
    const { response, data } = await GetAsset(accessToken);
    if (response?.status === 200) {
      setAsset(data);
    }
  };

  return {
    asset,
    getAsset,
  };
};