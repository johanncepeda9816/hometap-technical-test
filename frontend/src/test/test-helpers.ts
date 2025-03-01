/* eslint-disable @typescript-eslint/no-explicit-any */
export function createMockProviderResponse(items: any) {
  const response = [...items];
  Object.defineProperty(response, "error", { value: "", enumerable: true });
  return response;
}
