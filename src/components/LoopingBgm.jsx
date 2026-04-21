import React from 'react';

export function LoopingBgm({ enabled, volume }) {
  const audioRef = React.useRef(null);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    audio.volume = typeof volume === 'number' ? volume : 0.55;
  }, [volume]);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    audio.loop = true;

    if (enabled) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
      audio.currentTime = 0;
    }

    return () => {
      audio.pause();
    };
  }, [enabled]);

  return <audio ref={audioRef} src="./BGM1.mp3" preload="auto" hidden />;
}
