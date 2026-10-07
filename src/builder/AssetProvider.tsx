"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { loadAssetSession, type AssetSession } from "./asset-repository";
import { referencedAssetId, safeMediaURL, type Asset } from "./asset-model";
import { assetFontCSS } from "./asset-fonts";

const Context = createContext<{
  urls: Record<string, string>;
  pending: boolean;
  eager: boolean;
}>({ urls: {}, pending: false, eager: false });
export function AssetProvider({
  assets,
  session,
  eager = false,
  children,
}: {
  assets: Record<string, Asset>;
  eager?: boolean;
  session?: AssetSession;
  children: ReactNode;
}) {
  const key = Object.keys(assets).sort().join(",");
  const [epoch, setEpoch] = useState(0);
  useEffect(() => {
    const change = () => setEpoch((value) => value + 1);
    window.addEventListener("studio-assets-changed", change);
    return () => window.removeEventListener("studio-assets-changed", change);
  }, []);
  const requestKey = `${key}:${epoch}`;
  const [loaded, setLoaded] = useState<{
    key: string;
    session: AssetSession;
  } | null>(null);
  useEffect(() => {
    if (session || !key) return;
    let cancelled = false,
      owned: AssetSession | undefined;
    const manifest = Object.fromEntries(
      key.split(",").map((id) => [id, { id } as Asset]),
    );
    // Read immutable metadata from this render; only the set of hashes changes loading.
    for (const id of Object.keys(manifest)) manifest[id] = assets[id];
    void loadAssetSession(manifest).then((result) => {
      if (cancelled) result.dispose();
      else {
        owned = result;
        setLoaded({ key: requestKey, session: result });
      }
    });
    return () => {
      cancelled = true;
      owned?.dispose();
    };
    // Metadata changes do not require replacing already-loaded object URLs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, epoch, session]);
  const current =
    session ?? (loaded?.key === requestKey ? loaded.session : undefined);
  const fontCSS = assetFontCSS(assets, (id) => current?.urls[id]);
  return (
    <Context.Provider
      value={{ urls: current?.urls ?? {}, pending: !!key && !current, eager }}
    >
      {fontCSS && <style data-asset-fonts>{fontCSS}</style>}
      {children}
    </Context.Provider>
  );
}
export function useAssetSource(ref: string) {
  const context = useContext(Context),
    id = referencedAssetId(ref);
  return {
    eager: context.eager,
    src: id ? (context.urls[id] ?? "") : safeMediaURL(ref),
    pending: !!id && context.pending,
    missing: !!id && !context.pending && !context.urls[id],
  };
}
export function useAssetURLs() {
  return useContext(Context).urls;
}
