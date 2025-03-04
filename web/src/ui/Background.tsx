import React from 'react';

export default function Background() {
  return (
    <div style={styles.backgroundMain}>
      <div style={styles.backgroundMainBefore} />
      <div style={styles.backgroundMainAfter} />
      <div style={styles.backgroundMainGrid} />
      <div style={styles.backgroundContent} />
    </div>
  );
}
const styles: { [key: string]: React.CSSProperties } = {
  backgroundMain: {
    width: '100vw',
    minHeight: '100vh',
    position: 'fixed',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '120px 24px 160px 24px',
    // pointerEvents: "none",
    backgroundColor: '#0d1117', // Black background
  },
  backgroundMainBefore: {
    background: 'radial-gradient(circle, rgba(0, 0, 0, 0) 0, #1c1c1c 100%)', // Black gradient
    position: 'absolute',
    content: '""',
    zIndex: 2,
    width: '100%',
    height: '100%',
    top: 0,
  },
  backgroundMainAfter: {
    content: '""',
    zIndex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    opacity: 0.1,
  },
  backgroundMainGrid: {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    zIndex: 1,
    backgroundImage:
      'linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
    backgroundSize: '20px 20px',
  },
  backgroundContent: {
    zIndex: 3,
    width: '100%',
    maxWidth: '400px',
    backgroundImage: `linear-gradient(to bottom right, rgb(245 158 11 / 1), rgb(180 83 9 / 1))`,
    position: 'absolute',
    height: '400px',
    filter: 'blur(100px)',
    // top: "80px",
    opacity: 0.3,
  },
};
