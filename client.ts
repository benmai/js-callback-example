const debounceMs = 100;

export type Callback = (value: number) => void;
type Batch = { [key: string]: Callback[] };
type KVResponse = { [key: string]: number };

var pendingBatch: Batch = {};
var inFlightBatch: Batch = {};

export function getKey(key: string, cb: Callback) {
  if (key in inFlightBatch) {
    inFlightBatch[key].push(cb);
    return;
  }

  // If there is nothing in the pending batch, that means this is the first
  // call to getKey and we should call setTimeout below.
  const shouldEnqueueCall = Object.keys(pendingBatch).length === 0;

  if (key in pendingBatch) {
    pendingBatch[key].push(cb);
  } else {
    pendingBatch[key] = [cb];
  }

  if (!shouldEnqueueCall) {
    return;
  }

  setTimeout(() => {
    const keys = Object.keys(pendingBatch);
    inFlightBatch = { ...inFlightBatch, ...pendingBatch };
    pendingBatch = {};

    httpGetJson(`/read?keys=${keys.join(",")}`, (response: KVResponse) => {
      for (const key of keys) {
        const callbacks = inFlightBatch[key];
        for (const cb of callbacks) {
          cb(response[key]);
        }
        delete inFlightBatch[key];
      }
    });
  }, debounceMs);
}

const base = "http://localhost:3000";
async function httpGetJson(url: string, cb: (response: KVResponse) => void) {
  const fullUrl = `${base}${url}`;
  console.log(`Making network request with URL ${fullUrl}`);
  const response = await fetch(fullUrl);
  const json = await response.json();
  cb(json);
}
