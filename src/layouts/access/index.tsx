import LoginModal from '@/components/loginModal';
import { useModel } from '@umijs/max';
import { useEffect, type PropsWithChildren } from 'react';

export const AccessLayout = ({ children }: PropsWithChildren) => {
  const { accessToken, walletModalOpen, setWalletModalOpen } = useModel('useAccess');

  useEffect(() => {
    if (!accessToken) {
      setWalletModalOpen(true);
    } else {
      setWalletModalOpen(false);
    }
  }, [accessToken]);

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
