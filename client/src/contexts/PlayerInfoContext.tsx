import 
  React, 
  { createContext, 
    useContext, 
    useState,  
  } from 'react';

interface InputErrors {
  username: {
    reasons: string[]
  },
  roomId: {
    reasons: string[]
  }
}

type PlayerInfoContext = {
  username: string,
  roomId: string,
  setUsername: React.Dispatch<React.SetStateAction<string>>,
  setRoomId: React.Dispatch<React.SetStateAction<string>>,
  setInfoSubmitted: React.Dispatch<React.SetStateAction<boolean>>,
  hasPlayerInfo: () => boolean,
  submitPlayerInfo: () => InputErrors,
  logout: () => void,
}

const PlayerInfoContext = createContext<PlayerInfoContext | undefined>(undefined);

export function PlayerInfoProvider({ children } : { children: React.ReactNode }) {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [infoSubmitted, setInfoSubmitted] = useState(false);

  function isValidUsername() {
    return username.length >= 5;
  }

  function isValidRoomId() {
    return roomId.length >= 5;
  }

  function hasPlayerInfo() {
    return infoSubmitted && isValidUsername() && isValidRoomId();
  }
  
  function submitPlayerInfo() {
    if (isValidUsername() && isValidRoomId()) {
      setInfoSubmitted(true);
    }

    // TODO: Should make this a state.
    const errors : InputErrors = {
      username: {
        reasons: []
      },
      roomId: {
        reasons: []
      },
    };

    if (!isValidUsername()) {
      errors.username.reasons.push("Username must be at least 5 characters.");
    }

    if (!isValidRoomId()) {
      errors.roomId.reasons.push("RoomId must be at least 5 characters.");
    }

    return errors;
  }

  function logout() {
    // setUsername('');
    // setRoomId('');
    setInfoSubmitted(false);
  }
  
  return (
    <PlayerInfoContext.Provider value={{ username, roomId, setUsername, setRoomId, setInfoSubmitted, hasPlayerInfo, submitPlayerInfo, logout }}>
      {children}
    </PlayerInfoContext.Provider>
  );
};

export const usePlayerInfo = () => {
  const context = useContext(PlayerInfoContext);
  if(!context) {
    throw new Error('usePlayerInfo must be used within a PlayerInfoProvider.');
  }
  return context;
}


