const EXTERNAL_PROTOCOLS = ["http://", "https://", "data:", "blob:", "file:"];

export const resolveAssetUrl = (src: string) => {
  if (!src) {
    return src;
  }

  if (EXTERNAL_PROTOCOLS.some((protocol) => src.startsWith(protocol))) {
    return src;
  }

  if (src.startsWith("/")) {
    const baseUrl = import.meta.env.BASE_URL ?? "/";
    return `${baseUrl.replace(/\/$/, "")}${src}`;
  }

  return src;
};
