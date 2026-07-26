import "whatwg-fetch";
import { TextDecoder, TextEncoder } from "util";

const g = globalThis as typeof globalThis & {
  TextEncoder?: typeof TextEncoder;
  TextDecoder?: typeof TextDecoder;
  fetch?: typeof fetch;
  Headers?: typeof Headers;
  Request?: typeof Request;
  Response?: typeof Response;
};

if (!g.TextEncoder) {
  g.TextEncoder = TextEncoder;
}

if (!g.TextDecoder) {
  g.TextDecoder = TextDecoder;
}

// Ensure Node-provided Fetch API globals are available in Jest/jsdom.
if (!g.fetch && typeof globalThis.fetch === "function") {
  g.fetch = globalThis.fetch.bind(globalThis);
}

if (!g.Headers && typeof globalThis.Headers !== "undefined") {
  g.Headers = globalThis.Headers;
}

if (!g.Request && typeof globalThis.Request !== "undefined") {
  g.Request = globalThis.Request;
}

if (!g.Response && typeof globalThis.Response !== "undefined") {
  g.Response = globalThis.Response;
}
