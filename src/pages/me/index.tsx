import React from "react";
import styles from "./style.less";
import { AccessLayout } from "@/layouts/access";
import NavBar from "@/components/navBar";
import { ReactComponent as AvatarCircle } from '@/assets/me/avatar.svg';

const Me: React.FC = () => {
  return (
    <AccessLayout>
      <div className={styles.meContainer}>
        <div className={styles.meWrapper}>
          <div className={styles.meAvatar}>
            <div className={styles.meAvatarWrapper}>
              <AvatarCircle
                className={styles.meAvatarCircle}
              />
              <img
                className={styles.meAvatarImage}
                src="https://media.licdn.com/dms/image/C5103AQEjthnHx0FTLQ/profile-displayphoto-shrink_800_800/0/1536214237739?e=2147483647&v=beta&t=Th9UXbvF5Rc9oF6E-C4HFotvCZQbDj-AH5BVN2wtWbw"
                alt="avatar"
              />
            </div>
          </div>
        </div>
        <NavBar />
      </div>
    </AccessLayout>
  )
};

export default Me;
