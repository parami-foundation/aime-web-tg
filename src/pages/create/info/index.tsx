import React from "react";
import styles from "../style.less";
import EditBio from "./editBio";
import { Button, ConfigProvider, Image, Upload, theme } from "antd";
import { THEME_CONFIG } from "@/constants/theme";
import { RiEdit2Fill } from "react-icons/ri";
import { LuCamera } from "react-icons/lu";
import ImgCrop from "antd-img-crop";

const CreateInfo: React.FC<{
  avatar: Blob | null;
  setAvatar: React.Dispatch<React.SetStateAction<Blob | null>>;
  bio: string | null;
  setBio: React.Dispatch<React.SetStateAction<string | null>>;
  name: string | null;
  setName: React.Dispatch<React.SetStateAction<string | null>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}> = ({ avatar, setAvatar, bio, setBio, name, setName, setStep }) => {
  const [editBioModal, setEditBioModal] = React.useState<boolean>(false);

  return (
    <>
      <div className={styles.createWrapper}>
        <div className={styles.createHeader}>
          <div className={styles.createSteps}>
            1 / 2
          </div>
          <div className={styles.createAvatarContainer}>
            <ImgCrop
              cropShape="round"
            >
              <Upload
                accept="image/*"
                className={styles.createAvatarUpload}
                showUploadList={false}
                beforeUpload={(file) => {
                  setAvatar(file);
                  return false;
                }}
              >
                <div className={styles.createAvatar}>
                  <Image
                    className={styles.createAvatarImage}
                    src={avatar && URL.createObjectURL(avatar) || undefined}
                    fallback={require('@/assets/me/avatar.png')}
                    preview={false}
                  />
                </div>
                {!avatar && (
                  <div className={styles.createAvatarMask}>
                    <span>Upload</span>
                  </div>
                )}
                <div className={styles.createAvatarIcon}>
                  <LuCamera />
                </div>
              </Upload>
            </ImgCrop>
          </div>
          <div className={styles.createName}>
            {name || 'Your Name'}
          </div>
          <div className={styles.createDescription}>
            <div className={styles.createDescriptionTitle}>
              Your AIME Bio
            </div>
            <div className={styles.createDescriptionContent}>
              I am a boring person, but I tend to be passionate about making money.
            </div>
            <ConfigProvider
              theme={{
                algorithm: theme.defaultAlgorithm,
                token: {
                  wireframe: false,
                  colorPrimary: '#eeeeee',
                  borderRadius: THEME_CONFIG.borderRadius,
                  boxShadow: THEME_CONFIG.boxShadow,
                },
              }}
            >
              <Button
                type="primary"
                shape="round"
                className={styles.createDescriptionButton}
                onClick={() => setEditBioModal(true)}
              >
                <RiEdit2Fill className={styles.createDescriptionButtonIcon} />
                <span>Edit Bio</span>
              </Button>
            </ConfigProvider>
          </div>
        </div>
        <div className={styles.createFooter}>
          <Button
            block
            size="large"
            type="primary"
            shape="round"
            className={styles.createFooterButton}
            disabled={!avatar || !bio || !name}
            onClick={() => {
              setStep(2);
            }}
          >
            Next
          </Button>
        </div>
      </div>
      <EditBio
        visible={editBioModal}
        setVisible={setEditBioModal}
        bio={bio}
        setBio={setBio}
        closeable
      />
    </>
  )
};

export default CreateInfo;
