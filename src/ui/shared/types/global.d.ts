import React from "react";
import { MarvinSketcherInstance } from "@/types/marvinjs";

declare global {
  /**
   * Convenience type for a component with children.
   */
  type FCWithChildren<T = {}> = React.FC<T & React.PropsWithChildren>;

  // The documentation on the MarvinJSUtil functions can be found here:
  // https://docs.chemaxon.com/display/docs/how-to-embed.md#marvinjsutilgeteditoriframeid
  interface Window {}
}
