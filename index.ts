import { start } from "./server.ts";
import { getKey as clientGetKey, type Callback } from "./client.ts";

const getKey = (key: string, cb: Callback) => {
  console.log(`Calling getKey with key '${key}'.`);
  clientGetKey(key, cb);
};

// Helpers
const sleep = (ms: number) => {
  console.log(`Sleeping ${ms}ms...`);
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const makeCallback = (key: string, name: string) => (value: number) => {
  console.log(
    `I'm callback '${name}' set for key '${key}' and I was called with value '${value}'`,
  );
};

// Run examples
const cleanup = start();
await sleep(100); // Wait for the server to start.

// Example 1: 3 calls in quick succession, then another call after 100ms. We expect 2 API calls.
getKey("foo", makeCallback("foo", "cb1"));
await sleep(5);
getKey("bar", makeCallback("bar", "cb2"));
await sleep(5);
getKey("foo", makeCallback("foo", "cb3"));
await sleep(100);
getKey("baz", makeCallback("baz", "cb4"));

// Becuase API calls take
await sleep(2000);

// Example 2: three calls in quick succession
getKey("foo", makeCallback("foo", "cb1"));
await sleep(5);
getKey("bar", makeCallback("bar", "cb2"));
await sleep(5);
getKey("foo", makeCallback("foo", "cb3"));
await sleep(100);
getKey("foo", makeCallback("foo", "cb4"));

await sleep(2000);
cleanup();
