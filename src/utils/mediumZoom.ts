import mediumZoom from "medium-zoom/dist/pure";
import "medium-zoom/dist/style.css";

const zoom = mediumZoom({
  background: "rgba(0, 0, 0, 0.8)",
});

document.addEventListener("astro:page-load", () => zoom.detach());

export default zoom;
