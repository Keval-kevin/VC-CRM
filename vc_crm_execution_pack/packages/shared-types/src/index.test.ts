import { describe, expect, it } from "vitest";

import { crmProductName } from "./index";

describe("shared types package", () => {
  it("exports the product name", () => {
    expect(crmProductName).toBe("Virtual Coders CRM");
  });
});
