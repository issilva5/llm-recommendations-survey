import React from "react";
import styles from "./style.module.css";

function PageHeader({ title, description }) {
  return (
    <div className={styles.pageHeaderBox}>
      <h1 className={styles.pageHeaderTitle}>{title}</h1>
      <p className={styles.pageHeaderDescription}>{description}</p>
    </div>
  );
}

export default PageHeader;