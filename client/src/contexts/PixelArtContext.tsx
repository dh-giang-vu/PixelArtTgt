import
React,
{
  createContext,
  useContext,
  useState,
} from 'react';


type PixelArtContext = {
  pixelArt: HTMLImageElement | null;
  blockDimension: number | null;
  setBlockDimension: React.Dispatch<React.SetStateAction<number | null>>;
  setPixelArt: React.Dispatch<React.SetStateAction<HTMLImageElement | null>>;
  getPixelArtImageData: () => ImageData | null;
}

const PixelArtContext = createContext<PixelArtContext | undefined>(undefined);

export function PixelArtContextProvider({ children }: { children: React.ReactNode }) {

  const [pixelArt, setPixelArt] = useState<HTMLImageElement | null>(null);
  const [blockDimension, setBlockDimension] = useState<number | null>(null);

  function getPixelArtImageData() {
    if (!pixelArt) {
      return null;
    }
    let canvas = Object.assign(document.createElement('canvas'), {
      width: pixelArt.width,
      height: pixelArt.height
    });
  
    const context = canvas.getContext('2d');
    if (!context) {
      return null;
    }
  
    context.drawImage(pixelArt, 0, 0);
    const imgData = context.getImageData(0, 0, pixelArt.width, pixelArt.height);
    return imgData;
  }

  return (
    <PixelArtContext.Provider value={{ pixelArt, blockDimension, setBlockDimension, setPixelArt, getPixelArtImageData }}>
      {children}
    </PixelArtContext.Provider>
  );
};

export const usePixelArtContext = () => {
  const context = useContext(PixelArtContext);
  if (!context) {
    throw new Error('usePixelArtContext must be used within a PixelArtContextProvider.');
  }
  return context;
}


