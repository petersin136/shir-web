import type { MetadataRoute } from "next";

const ANDROID_TOUCH_ICON_URL =
  "https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/SHIRBAND_ANDROID%20TOUCH%20ICON_192.jpg";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SHIRBAND | SONG TO SING FOREVER",
    short_name: "SHIRBAND",
    description: "SHIRBAND - SONG TO SING FOREVER",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: ANDROID_TOUCH_ICON_URL,
        sizes: "192x192",
        type: "image/jpeg",
        purpose: "any",
      },
    ],
  };
}
