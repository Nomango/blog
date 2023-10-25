import { useEffect, useMemo, useRef, useState } from "react";
import "./Utterances.css";

export default function UtterancesComment({ slug }: { slug: string }) {
  const elementRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number>();

  const changeTheme = (theme: string) => {
    elementRef.current?.contentWindow?.postMessage(
      {
        type: "set-theme",
        theme: theme,
      },
      "https://utteranc.es"
    );
  };

  useEffect(() => {
    window.addEventListener("message", (e: any) => {
      if (e.origin !== "https://utteranc.es") return;
      if (e.data && e.data.type === "resize" && e.data.height) {
        setHeight(e.data.height);
      }
    });

    document.addEventListener(
      "themechange",
      (e: CustomEvent<"light" | "dark">) => {
        changeTheme(e.detail === "dark" ? "github-dark" : "github-light");
      }
    );
  }, []);

  const params = useMemo(() => {
    const initTheme =
      document.firstElementChild?.getAttribute("data-theme") === "dark"
        ? "github-dark"
        : "github-light";

    const url = new URL(location.href);
    const desc = document.querySelector("meta[name='description']");
    const ogTitle = document.querySelector(
      "meta[property='og:title'],meta[name='og:title']"
    );

    const options: Record<string, any> = {
      src: "https://utteranc.es/client.js",
      repo: "Nomango/blog",
      "issue-term": `[${slug}]`,
      label: "✨💬✨",
      theme: initTheme,
      crossorigin: "anonymous",
      url: url.origin + url.pathname + url.search,
      origin: url.origin,
      pathname:
        url.pathname.length < 2
          ? "index"
          : url.pathname.substr(1).replace(/\.\w+$/, ""),
      title: document.title,
      description: desc?.getAttribute("content") || "",
      "og:title": ogTitle?.getAttribute("content") || "",
    };
    return new URLSearchParams(options);
  }, []);
  return (
    <div className="utterances" style={{ height: `${height}px` }}>
      <iframe
        ref={elementRef}
        className="utterances-frame"
        title="Comments"
        src={`https://utteranc.es/utterances.html?${params}`}
        scrolling="no"
        loading="lazy"
      ></iframe>
    </div>
  );
}
