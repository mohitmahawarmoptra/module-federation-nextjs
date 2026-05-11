import { ComponentType, useEffect, useState } from "react";

declare const __webpack_init_sharing__: (scope: string) => Promise<void>;
declare const __webpack_share_scopes__: { default: unknown };

type RemoteContainer = {
  get(module: string): Promise<() => { default?: ComponentType } | ComponentType>;
  init(scope: unknown): Promise<void>;
};

type FederatedRemoteProps = {
  global: string;
  module: string;
  remoteEntryUrl: string;
  loadingText: string;
};

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[data-remote-entry="${src}"]`
    );

    if (existingScript?.dataset.loaded === "true") {
      resolve();
      return;
    }

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.dataset.remoteEntry = src;
    script.src = src;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error(`Unable to load ${src}`));
    document.head.appendChild(script);
  });
}

async function loadComponent(
  global: string,
  module: string,
  remoteEntryUrl: string
) {
  await loadScript(remoteEntryUrl);
  await __webpack_init_sharing__("default");

  const container = window[global as keyof Window] as RemoteContainer | undefined;

  if (!container) {
    throw new Error(`Remote container ${global} is not available.`);
  }

  try {
    await container.init(__webpack_share_scopes__.default);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (!message.includes("already initialized")) {
      throw error;
    }
  }

  const factory = await container.get(module);
  const exposedModule = factory();

  if (typeof exposedModule === "function") {
    return exposedModule;
  }

  if (!exposedModule.default) {
    throw new Error(`Remote module ${global}/${module} has no default export.`);
  }

  return exposedModule.default;
}

export default function FederatedRemote({
  global,
  module,
  remoteEntryUrl,
  loadingText,
}: FederatedRemoteProps) {
  const [Component, setComponent] = useState<ComponentType | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    loadComponent(global, module, remoteEntryUrl)
      .then((RemoteComponent) => {
        if (mounted) {
          setComponent(() => RemoteComponent);
          setError("");
        }
      })
      .catch((loadError) => {
        if (mounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load remote."
          );
        }
      });

    return () => {
      mounted = false;
    };
  }, [global, module, remoteEntryUrl]);

  if (error) {
    return (
      <div className="remote-loading" role="alert">
        {error}
      </div>
    );
  }

  if (!Component) {
    return <div className="remote-loading">{loadingText}</div>;
  }

  return <Component />;
}
