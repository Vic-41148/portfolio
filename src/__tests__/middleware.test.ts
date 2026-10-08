import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware, resolveCanonicalTarget } from "@/middleware";

describe("resolveCanonicalTarget", () => {
  it("redirects www to the apex, preserving path and query", () => {
    expect(
      resolveCanonicalTarget(
        "https://www.adityashibu.com/work/raksha?x=1",
        "www.adityashibu.com",
        "https"
      )
    ).toBe("https://adityashibu.com/work/raksha?x=1");
  });

  it("redirects www on the homepage too", () => {
    expect(
      resolveCanonicalTarget("https://www.adityashibu.com/", "www.adityashibu.com", null)
    ).toBe("https://adityashibu.com/");
  });

  it("upgrades http apex to https", () => {
    expect(
      resolveCanonicalTarget(
        "http://adityashibu.com/work/codeshield",
        "adityashibu.com",
        "http"
      )
    ).toBe("https://adityashibu.com/work/codeshield");
  });

  it("upgrades http www to https apex in one hop", () => {
    expect(
      resolveCanonicalTarget(
        "http://www.adityashibu.com/work/codeshield",
        "www.adityashibu.com",
        "http"
      )
    ).toBe("https://adityashibu.com/work/codeshield");
  });

  it("leaves https apex alone", () => {
    expect(
      resolveCanonicalTarget(
        "https://adityashibu.com/work/codeshield",
        "adityashibu.com",
        "https"
      )
    ).toBeNull();
  });

  it("ignores localhost and preview hosts", () => {
    expect(
      resolveCanonicalTarget(
        "http://localhost:3000/work/codeshield",
        "localhost:3000",
        "http"
      )
    ).toBeNull();
    expect(
      resolveCanonicalTarget(
        "https://portfolio-preview.example.workers.dev/work/codeshield",
        "portfolio-preview.example.workers.dev",
        "https"
      )
    ).toBeNull();
  });
});

describe("middleware", () => {
  it("lets an already-canonical request through untouched", () => {
    const res = middleware(
      new NextRequest("https://adityashibu.com/work/codeshield")
    );

    expect(res.status).toBe(200);
    expect(res.headers.get("location")).toBeNull();
  });
});
