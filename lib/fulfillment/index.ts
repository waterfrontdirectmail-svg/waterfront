// Fulfillment provider factory
// Switch providers by changing the environment variable

import type { FulfillmentProvider } from "./types";
import { ManualFulfillment } from "./manual";

export type { FulfillmentProvider } from "./types";
export { ManualFulfillment } from "./manual";

export function getFulfillmentProvider(): FulfillmentProvider {
  const provider = process.env.FULFILLMENT_PROVIDER || "manual";

  switch (provider) {
    case "manual":
      return new ManualFulfillment();
    // case "lob":
    //   return new LobFulfillment();
    // case "postgrid":
    //   return new PostGridFulfillment();
    default:
      throw new Error(`Unknown fulfillment provider: ${provider}`);
  }
}
