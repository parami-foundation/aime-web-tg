import { type PropsWithChildren } from 'react';
import { useSDKContext } from '@tma.js/sdk-react';
import { Button, Result, Spin } from 'antd';

interface SDKProviderErrorProps {
  error: unknown;
};

const SDKProviderError = ({ error }: SDKProviderErrorProps) => {
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
    >
      <blockquote>
        <code>
          {error instanceof Error
            ? error.message
            : JSON.stringify(error)}
        </code>
      </blockquote>
    </Result>
  );
};

const SDKProviderLoading = () => {
  return (
    <Spin tip="SDK is loading..." />
  );
};

const SDKInitialState = () => {
  return (
    <Result
      status="info"
      title="SDK init state"
      subTitle="Waiting for initialization to start."
    />
  );
};

const DisplayGate = ({ children }: PropsWithChildren) => {
  const { initResult, error } = useSDKContext();

  // There were no calls of SDK's init function. It means, we did not
  // even try to do it.
  if (!initResult && !error) {
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

export {
  DisplayGate,
  SDKProviderError,
  SDKProviderLoading,
  SDKInitialState
}