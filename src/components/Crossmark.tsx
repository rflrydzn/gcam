"use client";
import styles from "./Crossmark.module.css";
import { useState } from "react";

export default function CrossMark() {
  const [key, ] = useState(0);


  return (
    <div className="flex flex-col items-center justify-center">
      <div className={styles.errorMark} key={key}>
        <div className={styles.crossIcon}>
          <span className={`${styles.iconLine} ${styles.lineLeft}`}></span>
          <span className={`${styles.iconLine} ${styles.lineRight}`}></span>
          <div className={styles.iconCircle}></div>
        </div>
      </div>
      <p>Transaction rejected</p>
    </div>
  );
}