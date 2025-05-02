import styles from "./AnimatedBackground.module.css";

const AnimatedBackground = () => {
  return (
    <div className={styles.background}>
      {Array.from({ length: 20 }).map((_, index) => (
        <span key={index} className={styles[`span${index}`]}></span>
      ))}
    </div>
  );
};

export default AnimatedBackground;
