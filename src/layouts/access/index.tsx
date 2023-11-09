import LoginModal from '@/components/loginModal';
import { useModel } from '@umijs/max';
import { useEffect, type PropsWithChildren } from 'react';

export const AccessLayout = ({ children }: PropsWithChildren) => {
  const { accessToken, address, walletModalOpen, setWalletModalOpen } = useModel('useAccess');

  useEffect(() => {
    // if (!accessToken || !address) {
    //   setWalletModalOpen(true);
    // } else {
    //   setWalletModalOpen(false);
    // }
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
