console.log("Upload Worker Startup")
// eslint-disable-next-line no-undef
onconnect = function(e) {
    console.log("onconnect evt: ", e)
    var port = e.ports[0];
  
    port.onmessage = function(e) {
      var workerResult = 'Result: ' + (e.data[0] * e.data[1]);
      console.log("Worker message: ", e.data)
      port.postMessage(workerResult);
    }
  
}