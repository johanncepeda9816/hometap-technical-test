import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { LoadingComponent } from "../../components/loading";

describe("LoadingComponent", () => {
  it("renders the loading text correctly", () => {
    const { getByText } = render(<LoadingComponent />);
    const loadingText = getByText("Loading...");
    expect(loadingText).toBeDefined();
    expect(loadingText.tagName).toBe("P");
    expect(loadingText.className).toContain("text-blue-500");
  });

  it("renders a flex container with correct classes", () => {
    const { container } = render(<LoadingComponent />);
    const divElement = container.firstChild as HTMLElement;
    expect(divElement).toBeDefined();
    expect(divElement.className).toContain("flex");
    expect(divElement.className).toContain("items-center");
  });

  it("has proper structure with SVG followed by text", () => {
    const { container } = render(<LoadingComponent />);
    const divElement = container.firstChild;
    expect(divElement?.firstChild?.nodeName).toBe("svg");
    expect(divElement?.lastChild?.nodeName).toBe("P");
    expect(divElement?.lastChild?.textContent).toBe("Loading...");
  });
});
