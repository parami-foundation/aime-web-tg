import { history, useModel } from '@umijs/max';
import { useEffect, type PropsWithChildren } from 'react';

export const AccessLayout = ({ children }: PropsWithChildren) => {
  const { binded } = useModel('checkAccess');
  const { telegramData } = useModel('tmaInitData');

  useEffect(() => {
    // Check if user is logged in
    if (!binded) {
      history.push('/');
    } else {
      history.push('/chat/demo');
      // history.push('/home');
    }
  }, [binded, telegramData]);

  return (
    <>
      {children}
    </>
  );
}
