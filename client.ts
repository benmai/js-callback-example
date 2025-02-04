const debounceMs = 100;

export type Callback = (value: number) => void;
type Batch = { [key: string]: Callback[] };
type KVResponse = { [key: string]: number };

var batch: Batch = {};
var inFlightRequests: Batch = {};

export function getKey(key: string, cb: Callback) {
  if (key in inFlightRequests) {
    inFlightRequests[key].push(cb);
    return;
  }

  const shouldEnqueueCall = Object.keys(batch).length === 0;

  if (key in batch) {
    batch[key].push(cb);
  } else {
    batch[key] = [cb];
  }

  if (!shouldEnqueueCall) {
    return;
  }

  setTimeout(() => {
    const keys = Object.keys(batch);
    inFlightRequests = { ...inFlightRequests, ...batch };
    batch = {};

    httpGetJson(`/read?keys=${keys.join(",")}`, (response: KVResponse) => {
      for (const key of keys) {
        const callbacks = inFlightRequests[key];
        for (const cb of callbacks) {
          cb(response[key]);
        }
        delete inFlightRequests[key];
      }
    });
  }, debounceMs);
}

const base = "http://localhost:3000";
async function httpGetJson(url: string, cb: (response: KVResponse) => void) {
  const fullUrl = `${base}${url}`;
  console.log(`Made network request with URL ${fullUrl}`);
  const response = await fetch(fullUrl);
  const json = await response.json();
  cb(json);
}
