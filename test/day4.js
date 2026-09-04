
import http from 'http';

const server = http.createServer((req, res) => {
  const url = req.url;

  if (url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('hello world');
  }  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404: Page not found');
  }
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

