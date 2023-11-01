import { history, useModel } from '@umijs/max';
import { useEffect, type PropsWithChildren } from 'react';

export const AccessLayout = ({ children }: PropsWithChildren) => {
  const { accessToken } = useModel('checkAccess');
  const { telegramDataString } = useModel('tmaInitData');

  useEffect(() => {
    // Check if user is logged in
    if (!telegramDataString) {
      history.push('/');
    } else {
      history.push('/chat/demo');
    }
  }, [telegramDataString, accessToken]);

  return (
    <>
      {children}
    </>
  );
}
