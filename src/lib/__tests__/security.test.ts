import { describe, expect, it, vi } from "vitest";
import { enforceCsrfProtection, sanitizePayload } from "@/lib/security";

const { mockHeaders } = vi.hoisted(() => ({
  mockHeaders: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: mockHeaders,
}));

describe("sanitizePayload", () => {
  it("sanitizes nested strings", () => {
    const input = {
      name: "  <script>alert(1)</script> Ana  ",
      nested: {
        note: "javascript:alert(1)",
      },
      list: [" <b>ok</b> ", 123],
    };

    const result = sanitizePayload(input);

    expect(result).toEqual({
      name: "alert(1) Ana",
      nested: {
        note: "alert(1)",
      },
      list: ["ok", 123],
    });
  });
});

describe("enforceCsrfProtection", () => {
  it("allows same-host requests", async () => {
    mockHeaders.mockResolvedValue({
      get: (key: string) => {
        const map: Record<string, string | null> = {
          origin: "http://localhost:3000",
          host: "localhost:3000",
          "x-forwarded-host": null,
          "sec-fetch-site": "same-origin",
        };
        return map[key] ?? null;
      },
    });

    await expect(enforceCsrfProtection()).resolves.toBeUndefined();
  });

  it("blocks cross-site requests", async () => {
    mockHeaders.mockResolvedValue({
      get: (key: string) => {
        const map: Record<string, string | null> = {
          origin: "https://evil.example.com",
          host: "localhost:3000",
          "x-forwarded-host": null,
          "sec-fetch-site": "cross-site",
        };
        return map[key] ?? null;
      },
    });

    await expect(enforceCsrfProtection()).rejects.toThrow("Blocked cross-site request");
  });
});
