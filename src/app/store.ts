import create from "zustand";
import { createClient } from "@liveblocks/client";
import { liveblocks, WithLiveblocks } from "@liveblocks/zustand";

type Presence = {
    isTyping: boolean;
  };

type State = {
    fullName: string;
    isTyping: boolean;
    setFullName: (fullName: string) => void;
  };

const client = createClient({
  publicApiKey: "pk_prod_gCyerjnDvITjjjdx0LtsI1tVhtTyHf9PFOkTsBQRcxY_qCcOUYFZ4G25vJEpjnKG",
});

const useStore = create<WithLiveblocks<State, Presence>>()(
    liveblocks(
      (set) => ({
        fullName: "",
        isTyping: false,
        setFullName: (fullName) => set({ fullName, isTyping: fullName !== "" }),
      }),
      { client,
        presenceMapping: { isTyping: true },
       }
    )
  );

export default useStore;