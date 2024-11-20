import create from "zustand";
import { createClient } from "@liveblocks/client";
import { liveblocks, WithLiveblocks } from "@liveblocks/zustand";

type Cursor = {
  x: number ;
  y: number ;
} | null ;



type Presence = {
  isTypingFullName: boolean;
  isTypingProfession: boolean;
  cursor: Cursor;
  cardId: string | null;
};

type State = {
  cursor: Cursor ;
  cardId: string | null;
  fullName: string;
  profession: string;
  isTypingFullName: boolean;
  isTypingProfession: boolean;
  setFullName: (fullName: string) => void;
  setProfession: (profession: string) => void;
  setCursor: (cursor: Cursor) => void;
  boundingRect: DOMRect | null;
  setBoundingRect: (boundingRect: DOMRect | null) => void; 
};

const client = createClient({
  publicApiKey: "pk_prod_gCyerjnDvITjjjdx0LtsI1tVhtTyHf9PFOkTsBQRcxY_qCcOUYFZ4G25vJEpjnKG",
});

const useStore = create<WithLiveblocks<State, Presence>>()(
  liveblocks(
    (set) => ({
      cursor: null,
      cardId: "",
      fullName: "",
      profession: "",
      isTypingFullName: false,
      isTypingProfession: false,
      boundingRect: null,
      setBoundingRect: (boundingRect) => set({ boundingRect }),
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
      setCursor: (cursor) =>
        set({
          cursor,
        }),
    }),
    {
      client,
      presenceMapping: {
        isTypingFullName: true,
        isTypingProfession: true,
        cursor: true, 
        cardId: true,
      },
    }
  )
);

export default useStore;
