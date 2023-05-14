import React from "react";
import styles from "./style.module.css";

function InfoPage({ text }) {
    return (
        <div>
            {
                text.split("\n").map((t) => {
                    return <p className={styles.text}>{t}</p>
                })
            }
        </div>
    );
}



export default InfoPage;
