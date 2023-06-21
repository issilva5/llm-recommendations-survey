import React from "react";
import { FaCircleNotch } from 'react-icons/fa';
import styles from "./style.module.css";

function LoadingPage({ loadingMessage }) {
    return (
        loadingMessage ? <div className={styles.loadingContainer}>
            <FaCircleNotch className={styles.loadingIcon} />
            <p className={styles.loadingMessage}>{loadingMessage}</p>
        </div> : <></>
    );
}



export default LoadingPage;
