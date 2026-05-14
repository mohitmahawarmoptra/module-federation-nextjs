import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem("theme");
                  if (savedTheme) {
                    document.documentElement.setAttribute("data-theme", savedTheme);
                    document.body.setAttribute("data-theme", savedTheme);
                  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
                    document.documentElement.setAttribute("data-theme", "light");
                    document.body.setAttribute("data-theme", "light");
                  } else {
                    document.documentElement.setAttribute("data-theme", "dark");
                    document.body.setAttribute("data-theme", "dark");
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
