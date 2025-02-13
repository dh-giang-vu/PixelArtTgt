// import CustomColorPicker from "./TempCustomPicker";
import CustomColorPicker, { CustomColor } from "./CustomColorPicker";
import '../styles/game-board.css';
import useDivDimension from "../hooks/useElementDimension";
import { useEffect, useState } from "react";
import ImageUploader from "./ImageUploader";
import ArtPreviewCanvas from "./ArtPreviewCanvas";
import { usePixelArtContext } from "../contexts/PixelArtContext";
import ArtCanvas from "./ArtCanvas";
import { RgbColor } from "react-colorful";
import { hexToRgb, rgbToHex } from "../utils/colorConvert";
import { usePlayerInfo } from "../contexts/PlayerInfoContext";
import useWebSocket from "react-use-websocket";
import MusicPlayer from "./MusicPlayer";

export default function GameBoard() {
  const { ref, dimension } = useDivDimension();
  const [numOnline, setNumOnline] = useState(1);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [color, setColor] = useState<CustomColor>({
    rgb: { r: 0, g: 0, b: 0 },
    hex: "#000000"
  });
  const [isImageChooser, setIsImageChooser] = useState<boolean | null>(null);
  const { username, roomId } = usePlayerInfo();

  const WSS_URL = 'ws://localhost:3000';
  const ws = useWebSocket(
    WSS_URL,
    {
      queryParams: {
        username,
        roomId,
      },
      share: true,
    },
  );

  const { pixelArt, blockDimension, getPixelArtImageData, setPixelArt, setBlockDimension } = usePixelArtContext();
  const [serverPixelMap, setServerPixelMap] = useState<any[][] | null>(null);

  // check isImageChooser
  useEffect(() => {
    if (isImageChooser === true || pixelArt) {
      return;
    }

    const msg = ws.lastJsonMessage;
    if (msg && typeof msg === 'object' && 'imgChooser' in msg) {
      setIsImageChooser(msg.imgChooser === 1);
    }
  }, [ws.lastJsonMessage]);

  // check for pixel art of this room sent by server
  useEffect(() => {
    if (isImageChooser || pixelArt) {
      return;
    }

    const msg = ws.lastMessage;
    if (!msg || !(msg.data instanceof Blob)) {
      return;
    }

    msg.data.arrayBuffer()
      .then((ab) => {
        // convert array buffer to base64
        const bytes = new Uint8Array(ab);
        const blockDimension = bytes[0];

        const binaryStringArr = [];
        for (let i = 0; i < bytes.length - 5; i++) {
          binaryStringArr.push(String.fromCharCode(bytes[i+5]));
        }
        const binaryString = binaryStringArr.join('');
        const base64 = btoa(binaryString);

        // set pixel art image
        const url = "data:image/png;base64,"+base64;
        const image = new Image();
        image.src = url;
        setPixelArt(image);
        setBlockDimension(blockDimension);
      });

  }, [ws.lastMessage]);

  // check for pixelMap sent by server
  useEffect(() => {
    const msg = ws.lastJsonMessage;
    if (!msg || typeof msg !== 'object' || !('pixelMap' in msg)) {
      return;
    }
    if (Array.isArray(msg.pixelMap)) {
      setServerPixelMap(msg.pixelMap);
    }
  }, [ws.lastJsonMessage]);

  // check for number of online people sent by server
  useEffect(() => {
    const msg = ws.lastJsonMessage;
    if (msg && typeof msg === 'object' && 'numOnline' in msg && typeof msg.numOnline === 'number') {
      setNumOnline(msg.numOnline)
    }
  })


  function handleColorPickerChange(newColor: RgbColor | string) {
    let newHex = "#000000";
    let newRgb = { r: 0, g: 0, b: 0 };
    // hex input was changed
    if (typeof newColor === "string") {
      newRgb = hexToRgb(newColor);
      newHex = newColor;
    }
    // rgb input was changed
    else {
      newRgb = newColor;
      newHex = rgbToHex(newColor);
    }
    setColor({
      rgb: newRgb,
      hex: newHex
    });
  }

  async function handlePixelArtConfirmation(pixelArt: HTMLImageElement, blockDimension: number) {
    if (!image) {
      return;
    }

    const index = pixelArt.src.indexOf("base64,") + "base64,".length;
    const base64String = pixelArt.src.slice(index);

    // convert base64 string to ArrayBuffer (binary data)
    const binaryString = atob(base64String);
    const bytes = new Uint8Array(binaryString.length + 1);
    
    const numBlocksX = Math.ceil(image.width / blockDimension);
    const numBlocksY = Math.ceil(image.height / blockDimension);
    bytes[0] = blockDimension;            // attach block dimension to first byte
    bytes[1] = numBlocksX & 0xFF          // attach LSB of numBlocksX
    bytes[2] = (numBlocksX >> 8) & 0xFF   // attach MSB of numBlocksX
    bytes[3] = numBlocksY & 0xFF          // attach LSB of numBlocksY
    bytes[4] = (numBlocksY >> 8) & 0xFF   // attach MSB of numBlocksY

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i + 5] = binaryString.charCodeAt(i);
    }

    ws.sendMessage(bytes.buffer);
  }

  return (
    <div className="game-board-grid-container">

      <div className="sidebar sidebar-top">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>Music:</div>
          <MusicPlayer />
        </div>
      </div>

      <div className="sidebar sidebar-mid">
        <CustomColorPicker orientation="v" color={color} onChange={handleColorPickerChange} />
        <CustomColorPicker orientation="h" color={color} onChange={handleColorPickerChange} />
      </div>

      <div className="sidebar sidebar-bot">
        Online: {numOnline}
      </div>

      <div className="main" style={{ overflow: "hidden", position: "relative" }} ref={ref}>
        <div style={{ position: "absolute", width: "100%", height: "100%" }}>
          {pixelArt && blockDimension &&
            <ArtCanvas
              width={dimension.width}
              height={dimension.height}
              image={pixelArt}
              imageData={getPixelArtImageData()}
              blockDimension={blockDimension}
              pickedColor={color.rgb}
              predefinedPixelMap={serverPixelMap}
            />
          }
          {image && !pixelArt && <ArtPreviewCanvas width={dimension.width} height={dimension.height} image={image} onConfirm={handlePixelArtConfirmation} />}
          {isImageChooser === null && <h1>Loading...</h1>}
          {!image && !pixelArt && isImageChooser === false && <h1>Waiting for host...</h1>}
          {!image && !pixelArt && isImageChooser === true && <ImageUploader onUpload={(img) => setImage(img)} />}
        </div>
      </div>
    </div>
  )
}
