import React from "react";
import styles from './style.module.css'

function Title({ title }) {

    const date = new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <div className={styles.title}>
            <span className={styles.date}>{date}</span>
            <h1 className={styles.heading}>{title}</h1>
        </div>
    );
}

export default Title;
