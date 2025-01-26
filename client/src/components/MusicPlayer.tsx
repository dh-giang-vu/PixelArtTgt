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
    // Check if the YouTube IFrame API is already added
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Assign the global callback for the YouTube API
    (window as any).onYouTubeIframeAPIReady = () => {
      // console.log("iframe API ready");
      playerRef.current = new (window as any).YT.Player('player', {
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
            // console.log("player is ready");
          },
        },
      });
    };
  }, []);

  function changeVideo() {
    if (!playerRef.current) {
      return;
    }
    const nextVideoIndex = (currentVideo+1)%playlist.length;
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