import LoginModal from '@/components/loginModal';
import { history, useModel } from '@umijs/max';
import { useEffect, type PropsWithChildren, useState } from 'react';

export const AccessLayout = ({ children }: PropsWithChildren) => {
  const { accessToken, address } = useModel('useAccess');
  const { walletModalOpen, setWalletModalOpen } = useModel('useAccess');

  useEffect(() => {
    if (!accessToken || !address) {
      setWalletModalOpen(true);
    } else {
      setWalletModalOpen(false);
    }
  }, [accessToken, address]);

  return (
    <>
      {children}
      <LoginModal
        visible={walletModalOpen}
        setVisible={setWalletModalOpen}
      />
    </>
  );
}
