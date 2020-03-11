const WebSocket = require('ws');

function heartbeat() {
  clearTimeout(this.pingTimeout);
  console.log("ping")

  // Use `WebSocket#terminate()`, which immediately destroys the connection,
  // instead of `WebSocket#close()`, which waits for the close timer.
  // Delay should be equal to the interval at which your server
  // sends out pings plus a conservative assumption of the latency.
  this.pingTimeout = setTimeout(() => {
    this.terminate();
  }, 10000 + 1000);
}

const client = new WebSocket('ws://localhost:8080');

client.on('open', heartbeat);
client.on('ping', heartbeat);
client.on('close', function clear() {
  clearTimeout(this.pingTimeout);
});