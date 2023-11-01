import { history, useModel } from '@umijs/max';
import { useEffect, type PropsWithChildren } from 'react';

export const AccessLayout = ({ children }: PropsWithChildren) => {
  const { accessToken, address } = useModel('checkAccess');

  useEffect(() => {
    if (!accessToken || !address) {
      history.push('/');
    } else {
      history.push('/chat/demo');
    }
  }, [accessToken]);

  return (
    <>
      {children}
    </>
  );
}
