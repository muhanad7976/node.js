const http = require('http');
const taskRoutes = require('./Routes/taskroutes'); // Corrected import

const PORT = 9000;
const HOSTNAME = 'localhost';

const server = http.createServer((req, res) => {
    if (req.url.startsWith('/task')) {
        taskRoutes(req, res); // Call taskRoutes to handle requests
    } else {
        res.writeHead(404, 'Not Found', { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            message: 'Sorry, you got lost'
        }));
    }
});

server.listen(PORT, HOSTNAME, () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});
