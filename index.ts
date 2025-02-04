import { start as startServer } from "./server.ts";
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
const stopServer = startServer();
await sleep(100); // Wait for the server to start.

// Example 1: 3 calls in quick succession, then another call after 100ms.
// We expect 2 API calls, since the fourth key (baz) is not present in the
// initial batch.
getKey("foo", makeCallback("foo", "cb1"));
await sleep(5);
getKey("bar", makeCallback("bar", "cb2"));
await sleep(5);
getKey("foo", makeCallback("foo", "cb3"));
await sleep(100);
getKey("baz", makeCallback("baz", "cb4"));

// Because API calls take 1 second, wait 2 seconds here to ensure
// we finish all calls from example 1. A more robust way to do this
// would involve waiting for a certain number of callbacks to be called.
await sleep(2000);

// Example 2: three calls in quick succession, then a fourth call to a key
// already in-flight. We expect one API call, because the fourth call to
// getKey should piggy back on the existing in-flight batch.
getKey("foo", makeCallback("foo", "cb1"));
await sleep(5);
getKey("bar", makeCallback("bar", "cb2"));
await sleep(5);
getKey("foo", makeCallback("foo", "cb3"));
await sleep(100);
getKey("foo", makeCallback("foo", "cb4"));

await sleep(2000);
stopServer();
