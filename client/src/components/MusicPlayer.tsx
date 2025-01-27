import { VolumeOff, VolumeUp } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

const playlist = ["jfKfPfyJRdk", "4xDzrJKXOOY", "HuFYqnbVbzY"];

export default function MusicPlayer() {
  const playerRef = useRef<YT.Player | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(0);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";

      (window as any).onYouTubeIframeAPIReady = loadPlayer;

      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
    else {
      loadPlayer();
    }

    return () => {
      playerRef.current?.destroy();
    }
  }, []);

  function loadPlayer() {
    playerRef.current = new window.YT.Player('player', {
      height: '0',
      width: '0',
      videoId: 'jfKfPfyJRdk',
      playerVars: {
        playsinline: 1,
      },
      events: {
        onReady: () => {
          playerRef.current?.mute();
          playerRef.current?.playVideo();
          setIsReady(true);
        },
      },
    });
  }

  function changeVideo() {
    if (!playerRef.current) {
      return;
    }
    const nextVideoIndex = (currentVideo + 1) % playlist.length;
    const nextVideoId = playlist[nextVideoIndex];
    playerRef.current.loadVideoById(nextVideoId);
    setCurrentVideo(nextVideoIndex);
  }

  return (
    <>
      <div id="player" style={{ position: 'absolute' }}></div>

      <IconButton
        sx={{
          color: "#00beff"
        }}
        disabled={!isReady}
        onClick={() => {
          if (!playerRef.current) {
            return;
          }
          let player = playerRef.current;
          if (!player.isMuted()) {
            player.mute();
          }
          else {
            player.unMute();
          }
          setIsMuted(!isMuted);
        }}
      >
        {isMuted ? <VolumeOff /> : <VolumeUp />}
      </IconButton>


      <button disabled={!isReady} onClick={() => changeVideo()}>Next Track</button>

    </>
  );
}