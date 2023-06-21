import { useLocation } from "react-router-dom";
import styles from "./style.module.css";

function Error() {

    const { state } = useLocation();

    return (
        <>
            <div className={styles.container}>
                <div className={styles.pageHeaderBox}>
                    <h1 className={styles.pageHeaderTitle}>Error!</h1>
                    <p className={styles.pageHeaderDescription}>{state.error}</p>
                </div>
            </div>
        </>
    );

}

export default Error;