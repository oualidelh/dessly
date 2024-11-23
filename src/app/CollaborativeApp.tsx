"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase/supabaseClient";
import BioCard from "@/components/BioCard";
import useStore from "./store";
import { Cursor } from "@/components/Cursor";
// import { useSelf } from "./CollaborativeApp";
export { useSelf } from "@liveblocks/react/suspense";

type BioItem = {
  id: string;
  fullName: string;
  profession: string;
};


export function CollaborativeApp() {
  // const { name, avatar, colors } = useSelf((me) => me.info);
  const others = useStore((state) => state.liveblocks.others)
  const {cursor,setCursor} = useStore();
  const [bio, setBio] = useState<BioItem[]>([]);
  const [loading, setLoading] = useState(true);

  // console.log("useinfo", name, avatar, colors)

  useEffect(() => {
    useStore.getState().liveblocks.enterRoom("collaborative-room");
    return () => {
      useStore.getState().liveblocks.leaveRoom();
    };
  }, []);

  useEffect(() => {
    const loadBioData = async () => {
      const data = await fetchBioData();
      setBio(data);
      setLoading(false);
    };
    loadBioData();
  }, []);

  const fetchBioData = async (): Promise<BioItem[]> => {
    const { data, error } = await supabase.from("dessly").select();
    if (error) {
      console.error("Error fetching bio data:", error);
      return [];
    }
    return data || [];
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-3 relative w-[100%] h-[100%]"
    onPointerMove={(event) => {
      setCursor(
         {
          x: Math.round(event.clientX),
          y: Math.round(event.clientY)
        }
      )
    }}
    onPointerLeave={() => {
      setCursor(null)
    }}>
      {bio.map((item) => (
        <BioCard key={item.id} fullName={item.fullName} profession={item.profession} />
      ))}
      Cursor: {JSON.stringify(cursor)}
      {others
  .filter((other) => other.presence.cursor !== null)
  .map(({ connectionId, presence }) => {
    const { x, y } = presence.cursor!;
    return <Cursor key={connectionId} x={x} y={y} />;
  })}
    </div>
  );;
}