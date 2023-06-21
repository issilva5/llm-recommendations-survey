import React from "react";
import styles from "./style.module.css";

function RecPage({ item }) {
    return (
        <>
            <div className={styles.recInfo}>
                Our recommender system predicts you will {item.shouldWatch ? "like" : "dislike"} this movie.
                Below we explain the reason why.
            </div>

            <div className={styles.recPage}>
                <div className={styles.recItem}>
                    <label className={styles.fltLabel}>Recommendation</label>
                    <img src={item.poster} alt={item.title} className={styles.recPoster} />
                    <h1 className={styles.recTitle}>{item.title}</h1>
                </div>
                <div className={styles.recExplanation}>
                    <label className={styles.fltLabel}>Explanation</label>
                    <div className={styles.recExplanationBox}>
                        <p className={styles.recExplanationText}>{item.explanation}</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RecPage;
