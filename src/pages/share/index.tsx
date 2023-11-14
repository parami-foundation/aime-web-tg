import html2canvas from 'html2canvas';
import { ReactComponent as BackgroundImage } from '@/assets/share/share_bg.svg';
import { ReactComponent as LogoAndUrl } from '@/assets/share/logo_n_url.svg';
import { ReactComponent as AvatarRing } from '@/assets/share/avatar_ring.svg';
import { ReactComponent as MsgFrame } from '@/assets/share/msg_frame.svg';
import { ReactComponent as FooterBg } from '@/assets/share/footer_bg.svg';
import styles from './style.less';

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
          downloadLink.download = 'generated_image.png';

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
      <h1>Share Now</h1>
      <hr></hr>
      <div id="shareImage">
        <MsgFrame></MsgFrame>
        <img
          src="https://media.licdn.com/dms/image/C5103AQEjthnHx0FTLQ/profile-displayphoto-shrink_800_800/0/1536214237739?e=2147483647&v=beta&t=Th9UXbvF5Rc9oF6E-C4HFotvCZQbDj-AH5BVN2wtWbw"
          alt="avatar"
        />
      </div>
      <hr></hr>
      <div className={styles.shareContentContainer}>
        <div className={styles.logoContainer}>
          <LogoAndUrl></LogoAndUrl>
        </div>

        <div className={styles.aimeContainer}>
          <div className={styles.title}>
            I just bought {aimeName}'s AIME Power, Come with me now!
          </div>

          <div className={styles.avatarContainer}>
            <img
              className={styles.avatarImage}
              src="https://media.licdn.com/dms/image/C5103AQEjthnHx0FTLQ/profile-displayphoto-shrink_800_800/0/1536214237739?e=2147483647&v=beta&t=Th9UXbvF5Rc9oF6E-C4HFotvCZQbDj-AH5BVN2wtWbw"
              alt="avatar"
            />
            <AvatarRing className={styles.avatarRing}></AvatarRing>
          </div>

          <div className={styles.msgContainer}>
            <MsgFrame className={styles.msgFrame}></MsgFrame>
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
          <FooterBg></FooterBg>
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
