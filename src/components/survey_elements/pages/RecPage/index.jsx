import React from "react";
import styles from "./style.module.css";

function RecPage({ item }) {
  return (
    <div className={styles.recPage}>
      <div className={styles.recItem}>
        <img src={item.poster} alt={item.title} className={styles.recPoster} />
        <h1 className={styles.recTitle}>{item.title}</h1>
      </div>
      <div className={styles.recExplanation}>
        <div className={styles.recExplanationBox}>
          <p className={styles.recExplanationText}>{item.explanation}</p>
        </div>
      </div>
    </div>
  );
}

export default RecPage;
