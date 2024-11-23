import { Liveblocks } from "@liveblocks/node";
import { createClient } from "../../../../utils/supabase/server";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(): Promise<Response> {
  try {
    // Initialize Supabase client
    const supabase = await createClient();

    // Fetch the authenticated user
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    console.log("user",user)

    if (error || !user) {
      return new Response(
        JSON.stringify({ error: "Failed to retrieve the user." }),
        { status: 401 }
      );
    }

    // Extract optional metadata or provide defaults

    // Identify the user with Liveblocks
    const { status, body } = await liveblocks.identifyUser(
      {
        userId: user.id, // Required user ID
        groupIds: [], // Optional group IDs (add as needed)
      },
      { userInfo: {
        name: user.email || "Guest",
        avatar: user.user_metadata?.avatar_url,
        colors: [""],
      } }
    );
    console.log("this is the body",body)
    // Return Liveblocks response
    return new Response(body, { status });
  } catch (err) {
    console.error("Error in POST /identify-user:", err);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred." }),
      { status: 500 }
    );
  }
}
