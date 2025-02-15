import satori, { type SatoriOptions, type Font } from "satori";
import { Resvg } from "@resvg/resvg-js";
import postOgImage from "./og-templates/post";
import siteOgImage from "./og-templates/site";
import type { Post } from "./getPosts";

async function remoteFont(url: string, font: Omit<Font, "data">): Promise<Font> {
  const fontFile = await fetch(url);
  const data: ArrayBuffer = await fontFile.arrayBuffer();
  return {
    ...font,
    data: data,
  };
}

// async function localFont(path: string, font: Omit<Font, "data">): Promise<Font> {
//   const fs = await import("node:fs/promises");
//   const url = new URL(path, import.meta.url);
//   const data = await fs.readFile(url);
//   return {
//     ...font,
//     data: data,
//   };
// }

async function collectFonts(): Promise<Font[]> {
  // if (process.env.NODE_ENV === "development") {
  //   return Promise.all([
  //     localFont("../assets/fonts/ibm-plex-mono_5.0.8_latin-400-normal.ttf", {
  //       name: "IBM Plex Mono",
  //       weight: 400,
  //       style: "normal",
  //     }),
  //     localFont("../assets/fonts/ibm-plex-mono_5.0.8_latin-600-normal.ttf", {
  //       name: "IBM Plex Mono",
  //       weight: 600,
  //       style: "normal",
  //     }),
  //     localFont("../assets/fonts/noto-sans-sc_5.0.17_chinese-simplified-400-normal.woff", {
  //       name: "Noto Sans SC",
  //       weight: 400,
  //       style: "normal",
  //     }),
  //     localFont("../assets/fonts/noto-sans-sc_5.0.17_chinese-simplified-600-normal.woff", {
  //       name: "Noto Sans SC",
  //       weight: 600,
  //       style: "normal",
  //     }),
  //   ]);
  // }
  return Promise.all([
    remoteFont("https://cdn.jsdelivr.net/fontsource/fonts/ibm-plex-mono@latest/latin-400-normal.ttf", {
      name: "IBM Plex Mono",
      weight: 400,
      style: "normal",
    }),
    remoteFont("https://cdn.jsdelivr.net/fontsource/fonts/ibm-plex-mono@latest/latin-600-normal.ttf", {
      name: "IBM Plex Mono",
      weight: 600,
      style: "normal",
    }),
    remoteFont("https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-sc@latest/chinese-simplified-400-normal.woff", {
      name: "Noto Sans SC",
      weight: 400,
      style: "normal",
    }),
    remoteFont("https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-sc@latest/chinese-simplified-600-normal.woff", {
      name: "Noto Sans SC",
      weight: 600,
      style: "normal",
    }),
  ]);
}

const fonts = await collectFonts();

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

export async function generateOgSvgForPost(post: Post) {
  return await satori(postOgImage(post), options);
}

export async function generateOgImageForSite() {
  const svg = await satori(siteOgImage(), options);
  return svgBufferToPngBuffer(svg);
}
