/* eslint-disable @next/next/no-sync-scripts */
import { getTranslations as t } from "../locales";
import "../public/assets/styles/style.css";
import { checkTheme } from "../src/config/Theme";

//check wether the user prefers/chose dark theme
checkTheme();

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
