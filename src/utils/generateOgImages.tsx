import satori, { type SatoriOptions, type Font } from "satori";
import { Resvg } from "@resvg/resvg-js";
import postOgImage from "./og-templates/post";
import siteOgImage from "./og-templates/site";
import type { Post } from "./getPosts";

const fetchFonts = async (): Promise<Font[]> => {
  const fetchFont = async (url: string, font: Omit<Font, "data">): Promise<Font> => {
    const fontFile = await fetch(url);
    const data: ArrayBuffer = await fontFile.arrayBuffer();
    return {
      ...font,
      data: data,
    };
  };

  return Promise.all([
    fetchFont("https://cdn.jsdelivr.net/fontsource/fonts/ibm-plex-mono@latest/latin-400-normal.ttf", {
      name: "IBM Plex Mono",
      weight: 400,
      style: "normal",
    }),
    fetchFont("https://cdn.jsdelivr.net/fontsource/fonts/ibm-plex-mono@latest/latin-600-normal.ttf", {
      name: "IBM Plex Mono",
      weight: 600,
      style: "normal",
    }),
    fetchFont("https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-sc@latest/chinese-simplified-400-normal.woff", {
      name: "Noto Sans SC",
      weight: 400,
      style: "normal",
    }),
    fetchFont("https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-sc@latest/chinese-simplified-600-normal.woff", {
      name: "Noto Sans SC",
      weight: 600,
      style: "normal",
    }),
  ]);
};

const fonts = await fetchFonts();

const options: SatoriOptions = {
  width: 1200,
  height: 630,
  embedFont: true,
  fonts,
};

function svgBufferToPngBuffer(svg: string) {
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return pngData.asPng();
}

export async function generateOgImageForPost(post: Post) {
  const svg = await satori(postOgImage(post), options);
  return svgBufferToPngBuffer(svg);
}

export async function generateOgImageForSite() {
  const svg = await satori(siteOgImage(), options);
  return svgBufferToPngBuffer(svg);
}
