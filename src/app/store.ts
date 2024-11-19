import create from "zustand";
import { createClient } from "@liveblocks/client";
import { liveblocks, WithLiveblocks } from "@liveblocks/zustand";


type Presence = {
    isTypingFullName: boolean;
    isTypingProfession: boolean;
  };
  
  type State = {
    fullName: string;
    profession: string;
    isTypingFullName: boolean;
    isTypingProfession: boolean;
    setFullName: (fullName: string) => void;
    setProfession: (profession: string) => void;
  };
  
  const client = createClient({
    publicApiKey: "pk_prod_gCyerjnDvITjjjdx0LtsI1tVhtTyHf9PFOkTsBQRcxY_qCcOUYFZ4G25vJEpjnKG",
  });
  
  const useStore = create<WithLiveblocks<State, Presence>>()(
    liveblocks(
      (set) => ({
        fullName: "",
        profession: "",
        isTypingFullName: false,
        isTypingProfession: false,
        setFullName: (fullName) =>
          set({
            fullName,
            isTypingFullName: fullName !== "",
          }),
        setProfession: (profession) =>
          set({
            profession,
            isTypingProfession: profession !== "",
          }),
      }),
      {
        client,
        presenceMapping: {
          isTypingFullName: true,
          isTypingProfession: true,
        },
      }
    )
  );
  
  export default useStore;
  