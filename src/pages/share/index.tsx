import html2canvas from 'html2canvas';
import { ReactComponent as BackgroundImage } from '@/assets/share/share_bg.svg';
import { ReactComponent as LogoAndUrl } from '@/assets/share/logo_n_url.svg';
import { ReactComponent as AvatarRing } from '@/assets/share/avatar_ring.svg';
import { ReactComponent as MsgFrame } from '@/assets/share/msg_frame.svg';
import { ReactComponent as FooterBg } from '@/assets/share/footer_bg.svg';
import sunAvatar from '@/assets/share/sun_avatar.jpeg';
import styles from './style.less';
import { QRCodeSVG } from 'qrcode.react';

const Share: React.FC = () => {

  const generateImage = () => {
    // 获取要生成图像的DOM元素
    const targetElement = document.getElementById('shareImage');

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
  }

  const aimeName = 'justinsun';

  return (
    <div>
      <div className={styles.shareContentContainer} id="shareImage">
        <div className={styles.logoContainer}>
          <LogoAndUrl />
        </div>

        <div className={styles.aimeContainer}>
          <div className={styles.title}>
            I just bought {aimeName}'s AIME Power, Come with me now!
          </div>

          <div className={styles.avatarContainer}>
            <img
              className={styles.avatarImage}
              src={sunAvatar}
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
              {aimeName}'s AIME:
            </div>
            <div className={styles.msg}>
              “ Come with me, let's make money together.
              I will take you to new heights of earning money.”
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.referInfo}>
              <div className={styles.referTitle}>Referral Code</div>
              <div className={styles.referCode}>6a5c34</div>
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

        <div className={styles.bgContainer}>
          <BackgroundImage />
        </div>
      </div>

      <button onClick={generateImage}>Generate Image</button>
    </div>
  );
}

export default Share;
