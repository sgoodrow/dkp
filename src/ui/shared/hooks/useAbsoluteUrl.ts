"use client";

import { uiQueryParams } from "@/app/uiQueryParams";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const utmSource = `${uiQueryParams.utm_source}=castledkp`;

type Options = {
  withUtmSource?: boolean;
};

/**
 * Returns the current absolute URL.
 *
 * If you only need the relative URL, use `usePathname`.
 */
export const useAbsoluteUrl = ({ withUtmSource }: Options = {}) => {
  const [url, setUrl] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // The absolute URL can be retrieved from the browser window. Since the window
  // is only available in the browser, we wait for the mount event before accessing it.
  //
  // Since the window object will not trigger a re-render, we recalculate the url when
  // the relative pathname changes.
  useEffect(() => {
    let updated = window.location.href;
    if (withUtmSource) {
      updated += window.location.href.includes("?")
        ? "&" + utmSource
        : "?" + utmSource;
    }
    setUrl(updated);
  }, [pathname, searchParams, withUtmSource]);

  return url;
};
