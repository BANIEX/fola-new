import "@/styles/globals.css";
import { useAccountState } from "@/zustand/account";
import { NextUIProvider } from "@nextui-org/react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { SnackbarProvider } from "notistack";
import Footer from "@/components/Footer/Footer";
import Script from "next/script";
import { Inter, Inter_Tight } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter_tight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: '--font-inter_tight'
});

function getCookiesMap(cookiesString) {
  return cookiesString
    .split(";")
    .map(function (cookieString) {
      return cookieString.trim().split("=");
    })
    .reduce(function (acc, curr) {
      acc[curr[0]] = curr[1];
      return acc;
    }, {});
}


export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const accountState = useAccountState();
  useEffect(() => {
    const handleAuthChange = () =>
      fetch("/api/auth/get-info", {
        credentials: "include",
      })
        .then((res) => (res.ok ? res.json() : -1))
        .then((data) => {
          if (data === -1 || data.status === "error")
            return accountState.setError({
              status: true,
              message: "Couldn't Fetch Account Info. Clear cookies?",
            });
          return accountState.setAccount(data.u);
        });
    document.addEventListener(
      "cookiechange",
      ({ detail: { oldValue, newValue } }) => {
        const update =
          getCookiesMap(oldValue)?.["auth.user"] !==
          getCookiesMap(newValue)?.["auth.user"];
        console.log(
          `Cookie changed auth.user ${update ? "updated" : "not-updated"}`
        );
        if (!getCookiesMap(newValue)?.["auth.user"])
          return accountState.setAccount(null);
        if (update) return handleAuthChange();
      }
    );
    if (!accountState.account) handleAuthChange();
  }, [router.pathname]);

  
  return (
    <NextUIProvider>
      <SnackbarProvider>
        <main
          className={`${inter.className} ${inter_tight.variable} light text-foreground bg-background`}
        >
          <Script src="/static/cookie-change-injection.js" />
          <GoogleAnalytics trackPageViews />
          <Component {...pageProps} />
          {/^\/(about|cart|products|product\/[^\/]+)?$/.test(
            router.pathname
          ) && <Footer />}
        </main>
      </SnackbarProvider>
    </NextUIProvider>
  );
}
