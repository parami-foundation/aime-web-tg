import { useMemo, type PropsWithChildren } from 'react';
import { useSDK } from '@tma.js/sdk-react';
import { Button, Result, Spin, Typography } from 'antd';

export const DisplayGate = ({ children }: PropsWithChildren<{}>) => {
  const { Paragraph } = Typography;

  const { didInit, components, error } = useSDK();
  const errorMessage = useMemo<null | string>(() => {
    if (!error) {
      return null;
    }

    return error instanceof Error ? error.message : 'Unknown error';
  }, [error]);

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

  // Error occurred during SDK init.
  if (error !== null) {
    return (
      <Result
        status="error"
        title="SDK was unable to initialize."
        subTitle="Probably, current application is being used not in Telegram Web Apps environment."
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
      >
        <Paragraph>
          {errorMessage}
        </Paragraph>
      </Result>
    );
  }

  // If components is null, it means, SDK is not ready at the
  // moment and currently initializing. Usually, it takes like
  // several milliseconds or something like that, but we should
  // have this check.
  if (components === null) {
    return (
      <Spin tip="Loading" size="large" />
    );
  }

  // Safely render application.
  return children;
};