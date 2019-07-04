const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

console.log("### Reading test-cluster.js at " + new Date().getTime()+" ###");

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    http.createServer((req, res) => {
        console.log(`Worker ${process.pid} has received a request...`);
        res.writeHead(200);
        res.end(`hello world from Worker ${process.pid}\n`);
    }).listen(9000);

    console.log(`Worker ${process.pid} started`);
}