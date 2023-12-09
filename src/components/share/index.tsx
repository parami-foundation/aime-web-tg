import React, { useEffect } from 'react';
import styles from './style.less';
import { Button, Modal } from 'antd';
import { ReactComponent as BackgroundImage } from '@/assets/share/share_bg.svg';
import { ReactComponent as LogoAndUrl } from '@/assets/share/logo_n_url.svg';
import { ReactComponent as AvatarRing } from '@/assets/share/avatar_ring.svg';
import { ReactComponent as MsgFrame } from '@/assets/share/msg_frame.svg';
import { ReactComponent as FooterBg } from '@/assets/share/footer_bg.svg';
import { useModel } from '@umijs/max';
import { QRCodeSVG } from 'qrcode.react';
import sha256 from 'crypto-js/sha256';
import html2canvas from 'html2canvas';
import { IoClose } from 'react-icons/io5';

const Share: React.FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
  userId: string;
}> = ({ visible, setVisible, userId }) => {
  const { character } = useModel('useSetting');

  const [imageData, setImageData] = React.useState<string>();
  const [referCode, setReferCode] = React.useState<string>();

  const shareRef = React.createRef<HTMLDivElement>();

  const loadImage = () => {
    const imageUrl = character?.avatar_url;
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = image.width;
        canvas.height = image.height;

        context.drawImage(image, 0, 0);
        const dataURL = canvas.toDataURL('image/png');

        setImageData(dataURL);
      }
    };

    image.src = imageUrl!;
  };

  const getReferCode = (userId: string) => {
    const hash = sha256(userId);
    const referCode = hash.toString().substring(0, 6);
    setReferCode(referCode);
  };

  const generateImage = () => {
    // 获取要生成图像的DOM元素
    const targetElement = shareRef?.current;

    if (targetElement) {
      // 使用html2canvas将DOM元素转换为Canvas
      html2canvas(targetElement)
        .then((canvas) => {
          // 将Canvas转换为图像数据URL
          const dataURL = canvas.toDataURL('image/png');

          // 创建一个下载链接
          const downloadLink = document.createElement('a');
          downloadLink.href = dataURL;
          downloadLink.download = 'AIME_Share.png';

          // 模拟点击下载链接
          downloadLink.click();
        })
        .catch((error) => {
          console.error('Error generating image:', error);
        });
    } else {
      console.error('No target element');
    }
  };

  useEffect(() => {
    loadImage();
    getReferCode(userId);
  }, [character]);

  return (
    <Modal
      centered
      title={null}
      footer={null}
      className={styles.shareModal}
      open={visible}
      onCancel={() => setVisible(false)}
      closeIcon={<IoClose className={styles.shareModalCloseIcon} />}
    >
      <div
        className={styles.shareContentContainer}
        ref={shareRef}
      >
        <div className={styles.shareContentWrapper}>
          <div className={styles.logoContainer}>
            <LogoAndUrl />
          </div>

          <div className={styles.aimeContainer}>
            <div className={styles.title}>
              I just bought {character?.name}'s AIME Power, Come with me now!
            </div>

            <div className={styles.avatarContainer}>
              <img
                className={styles.avatarImage}
                src={imageData}
                alt="avatar"
              />
              <div className={styles.avatarRingContainer}>
                <AvatarRing />
              </div>
            </div>

            <div className={styles.msgContainer}>
              <div className={styles.msgFrameContainer}>
                <MsgFrame />
              </div>
              <div className={styles.msgTitle}>
                {character?.name}'s AIME:
              </div>
              <div className={styles.msg}>
                “ {character?.share_message}”
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <div className={styles.footerContent}>
              <div className={styles.referInfo}>
                <div className={styles.referTitle}>Referral Code</div>
                <div className={styles.referCode}>{referCode}</div>
                <div className={styles.referDesc}>
                  Purchase <span className={styles.referDescBold}>AIME Powers</span> of influencers and share the growth profits.
                </div>
              </div>
              <div className={styles.qrCodeContainer}>
                <QRCodeSVG value="https://t.me/aime_beta_bot/aimeapp" bgColor="#EAFD53" width={84} height={84} />
              </div>
            </div>

            <div className={styles.footerBgContainer}>
              <FooterBg />
            </div>
          </div>
        </div>
        <div className={styles.bgContainer}>
          <BackgroundImage />
        </div>
      </div>

      <Button
        block
        type='primary'
        size='large'
        onClick={generateImage}
        className={styles.generateButton}
      >
        Generate Image
      </Button>
    </Modal>
  )
};

export default Share;