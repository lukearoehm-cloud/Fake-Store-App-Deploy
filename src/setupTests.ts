import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

Object.assign(global, { TextEncoder, TextDecoder });

// Polyfills for web APIs - needed for Firebase in tests
global.fetch = jest.fn();
global.Response = class Response {
  constructor(public body?: any) {}
} as any;
global.Request = class Request {
  constructor(public url: string) {}
} as any;
