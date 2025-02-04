import * as http from "http";

// The server serves KV data on the /read endpoint, and returns a default value of 0.

const port = 3000;
const latencyMs = 1000;
const data: { [key: string]: number } = {
  foo: 42340234,
  bar: 29384092834,
  baz: 2934,
};

const server = http.createServer(async (req, res) => {
  if (req.url === undefined) {
    res.writeHead(500);
    res.end("URL was undefined");
    return;
  }

  const url = new URL(req.url, `http://localhost:${port}`);

  if (req.method !== "GET" || url.pathname !== "/read") {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, latencyMs));

  const keys = (url.searchParams.get("keys") || "").split(",");
  const values = keys.reduce((acc, key) => {
    const value = data[key] || 0;
    return { ...acc, [key]: value };
  }, {});
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(values));
});

export const start = () => {
  const s = server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });

  return () => {
    s.close();
  };
};
