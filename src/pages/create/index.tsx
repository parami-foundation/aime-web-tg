import React from "react";
import styles from "./style.less";
import { AccessLayout } from "@/layouts/access";
import CreateInfo from "./info";
import CreateRecord from "./record";


const Create: React.FC = () => {
  const [step, setStep] = React.useState<number>(1);
  const [avatar, setAvatar] = React.useState<Blob | null>(null);
  const [bio, setBio] = React.useState<string | null>(null);
  const [name, setName] = React.useState<string | null>(null);
  const [record, setRecord] = React.useState<Blob | null>(null);

  return (
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
    </div>
  )
};

export default Create;
