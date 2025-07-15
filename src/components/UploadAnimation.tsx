import styles from './UploadAnimation.module.css';
import Checkmark from './Checkmark';
const UploadAnimation = () => {
  return (
    <div className={styles.upload}>
      <div className={styles['text-upload']}>Uploading...</div>
      <div />
      <svg className={styles['progress-wrapper']} viewBox="0 0 300 300">
        <circle
          className={styles.progress}
          r="115"
          cx="150"
          cy="150"
        ></circle>
      </svg>
      <Checkmark />
    </div>
  );
};

export default UploadAnimation;