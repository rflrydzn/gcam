"use client";
import { useState } from "react";
import styles from "./Checkmark.module.css";

export default function Checkmark({text} : {text: string}) {
  const [key, ] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={styles.successCheckmark} key={key}>
        <div className={styles.checkIcon}>
          <span className={`${styles.iconLine} ${styles.lineTip}`}></span>
          <span className={`${styles.iconLine} ${styles.lineLong}`}></span>
          <div className={styles.iconCircle}></div>
          <div className={styles.iconFix}></div>
        </div>
        
      </div>
      <p>{text === 'upload' ? 'Upload Done' : text === 'accept' ? 'Transaction done' : null}</p>
    </div>
  );
}