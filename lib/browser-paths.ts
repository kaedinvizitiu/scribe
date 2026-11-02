function documentValue(name: string) {
  if (typeof document === "undefined") return "";
  return document.documentElement.dataset[name] ?? "";
}

export function apiUrl(path: string) {
  return `${documentValue("apiBase").replace(/\/$/, "")}${path}`;
}

export function siteHref(path: string) {
  const staticBase = documentValue("staticBase");
  if (!staticBase) return path;
  return `${staticBase.replace(/\/$/, "")}/#${path}`;
}
