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
}

const PixelArtContext = createContext<PixelArtContext | undefined>(undefined);

export function PixelArtContextProvider({ children }: { children: React.ReactNode }) {

  const [pixelArt, setPixelArt] = useState<HTMLImageElement | null>(null);
  const [blockDimension, setBlockDimension] = useState<number | null>(null);

  return (
    <PixelArtContext.Provider value={{ pixelArt, blockDimension, setBlockDimension, setPixelArt }}>
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


