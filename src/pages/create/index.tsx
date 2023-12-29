import React, { useEffect } from "react";
import styles from "./style.less";
import { AccessLayout } from "@/layouts/access";
import { useModel, history } from "@umijs/max";
import CreateInfo from "./info";
import CreateRecord from "./record";
import Loading from "./loading";
import Success from "./success";
import { InitData } from "@tma.js/sdk";
import { TelegramOauthDataOnauthProps } from "@/types";

const Create: React.FC = () => {
  const { profile } = useModel("useAccess");
  const { telegramData, miniAppBackButton, miniAppMainButton } = useModel("useTelegram");

  const [step, setStep] = React.useState<number>(1);
  const [avatar, setAvatar] = React.useState<Blob | null>(null);
  const [bio, setBio] = React.useState<string | null>(profile?.bio || null);
  const [name, setName] = React.useState<string | null>(profile?.name || (telegramData as InitData)?.user?.firstName || (telegramData as TelegramOauthDataOnauthProps)?.first_name || null);
  const [record, setRecord] = React.useState<Blob | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [successModal, setSuccessModal] = React.useState<boolean>(false);

  useEffect(() => {
    if (!!miniAppBackButton) {
      miniAppBackButton?.show();
      miniAppBackButton?.on('click', () => {
        history.push('/me');
      });
    }
  }, [miniAppBackButton]);

  useEffect(() => {
    if (!!miniAppMainButton) {
      miniAppMainButton?.show();
      miniAppMainButton?.on('click', () => {
        history.push('/');
      });
    }
  }, [miniAppMainButton]);

  return (
    <AccessLayout>
      <div className={styles.createContainer}>
        {step === 1 && (
          <CreateInfo
            avatar={avatar}
            setAvatar={setAvatar}
            bio={bio}
            setBio={setBio}
            name={name}
            setName={setName}
            setStep={setStep}
          />
        )}
        {step === 2 && (
          <CreateRecord
            record={record}
            setRecord={setRecord}
          />
        )}
        <Loading
          visible={loading}
          setVisible={setLoading}
        />
        <Success
          visible={successModal}
          setVisible={setSuccessModal}
        />
      </div>
    </AccessLayout>
  )
};

export default Create;
