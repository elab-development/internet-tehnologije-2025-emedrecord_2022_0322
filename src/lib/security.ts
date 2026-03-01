import { headers } from "next/headers";

const parseTrustedOrigins = () => {
  const trusted = process.env.TRUSTED_ORIGINS || "";

  return trusted
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map((origin) => {
      try {
        return new URL(origin).host;
      } catch {
        return origin.replace(/^https?:\/\//, "");
      }
    });
};

const sanitizeString = (value: string): string => {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim();
};

export const sanitizePayload = <T>(value: T): T => {
  if (typeof value === "string") {
    return sanitizeString(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizePayload(item)) as T;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).map(
      ([key, item]) => [key, sanitizePayload(item)]
    );

    return Object.fromEntries(entries) as T;
  }

  return value;
};

export const enforceCsrfProtection = async () => {
  const requestHeaders = await headers();

  const origin = requestHeaders.get("origin");
  const host =
    requestHeaders.get("x-forwarded-host") || requestHeaders.get("host");
  const secFetchSite = requestHeaders.get("sec-fetch-site");

  if (!origin || !host) {
    throw new Error("Invalid request origin");
  }

  const originHost = new URL(origin).host;

  const allowedHosts = new Set<string>([host, ...parseTrustedOrigins()]);

  if (!allowedHosts.has(originHost)) {
    throw new Error("Blocked cross-site request");
  }

  if (secFetchSite && secFetchSite.toLowerCase() === "cross-site") {
    throw new Error("Blocked cross-site request");
  }
};
