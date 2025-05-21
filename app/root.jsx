import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import MainNavigation, {
  links as mainNavigationLinks,
} from "~/components/MainNavigation/MainNavigation.jsx";

import styles from "~/styles/main.css?url";

export const meta = () => [
  {
    charset: "utf-8",
    title: "Simple Notes Application",
    viewport: "width=device-width,initial-scale=1",
  },
];

export function links() {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
    ...mainNavigationLinks(),
  ];
}

export function Layout() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <MainNavigation />
        </header>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}

// eslint-disable-next-line react/prop-types
function CatchBoundary({ error }) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        {/* eslint-disable-next-line react/prop-types */}
        <title>{error.statusText}</title>
      </head>
      <body>
        <header>
          <MainNavigation />
        </header>
        <main className="error">
          {/* eslint-disable-next-line react/prop-types */}
          <h1>{error.statusText}</h1>
          {/* eslint-disable-next-line react/prop-types */}
          <p>{error.data?.message || "Something went wrong!"}</p>
          <p>
            Back to <Link to="/">safety</Link>!
          </p>
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const response = isRouteErrorResponse(error);

  if (response) {
    return <CatchBoundary error={error} />;
  }

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <title>An error occurred!</title>
      </head>
      <body>
        <header>
          <MainNavigation />
        </header>
        <main className="error">
          <h1>An error occurred!</h1>
          <p>{error.message}</p>
          <p>
            Back to <Link to="/">safety</Link>!
          </p>
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
