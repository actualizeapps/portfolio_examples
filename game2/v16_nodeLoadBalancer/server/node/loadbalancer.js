const http = require('http');

// List of backend servers
const servers = [
  { host: 'localhost', port: 3001 },
  { host: 'localhost', port: 3002 },
  { host: 'localhost', port: 3003 },
];

let current = 0;

const loadBalancer = http.createServer((clientReq, clientRes) => {
  // Pick next backend server (round robin)
  const { host, port } = servers[current];
  current = (current + 1) % servers.length;

  // Forward the request to the selected backend
  const options = {
    hostname: host,
    port: port,
    path: clientReq.url,
    method: clientReq.method,
    headers: clientReq.headers,
  };

  const proxy = http.request(options, (serverRes) => {
    clientRes.writeHead(serverRes.statusCode, serverRes.headers);
    serverRes.pipe(clientRes, { end: true });
  });

  proxy.on('error', (err) => {
    console.error(`Error connecting to backend ${host}:${port} - ${err.message}`);
    clientRes.writeHead(502);
    clientRes.end('Bad Gateway');
  });

  clientReq.pipe(proxy, { end: true });
});

loadBalancer.listen(3000, () => {
  console.log('Load balancer running on port 3000');
});