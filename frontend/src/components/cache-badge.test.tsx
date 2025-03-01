import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { CacheBadge } from "./cache-badge";
import "@testing-library/jest-dom";

describe("CacheBadge", () => {
  it('renders "Cached" with blue styling when isCached is true', () => {
    const { getByText } = render(<CacheBadge isCached={true} />);

    const badge = getByText("Cached");

    expect(badge.className).toContain("bg-blue-100");
    expect(badge.className).toContain("text-blue-800");
    expect(badge.className).toContain("ml-2");
    expect(badge.className).toContain("px-2");
    expect(badge.className).toContain("py-1");
    expect(badge.className).toContain("text-xs");
    expect(badge.className).toContain("font-medium");
    expect(badge.className).toContain("rounded-full");
  });

  it('renders "Live" with gray styling when isCached is false', () => {
    const { getByText } = render(<CacheBadge isCached={false} />);

    const badge = getByText("Live");

    expect(badge.className).toContain("bg-gray-100");
    expect(badge.className).toContain("text-gray-800");
    expect(badge.className).toContain("ml-2");
    expect(badge.className).toContain("px-2");
    expect(badge.className).toContain("py-1");
    expect(badge.className).toContain("text-xs");
    expect(badge.className).toContain("font-medium");
    expect(badge.className).toContain("rounded-full");
  });

  it("has the correct accessibility attributes", () => {
    const { getByText } = render(<CacheBadge isCached={true} />);

    const badge = getByText("Cached");

    expect(badge.tagName).toBe("SPAN");
  });

  it("snapshot test - cached state", () => {
    const { container } = render(<CacheBadge isCached={true} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("snapshot test - live state", () => {
    const { container } = render(<CacheBadge isCached={false} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
