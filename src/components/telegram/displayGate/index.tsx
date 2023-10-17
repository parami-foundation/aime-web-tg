import { type PropsWithChildren } from 'react';
import { useSDK } from '@tma.js/sdk-react';
import { Button, Result } from 'antd';

export const DisplayGate = ({ children }: PropsWithChildren) => {
  const { didInit } = useSDK();

  // There were no calls of SDK's init function. It means, we did not
  // even try to do it.
  if (!didInit) {
    return (
      <Result
        status="error"
        title="SDK init error"
        subTitle="SDK init function is not yet called."
        extra={[
          <Button
            type="primary"
            key="retry"
            size='large'
            onClick={() => {
              window.location.reload();
            }}
          >
            Retry
          </Button>,
        ]}
      />
    );
  }

  // Safely render application.
  return children;
};