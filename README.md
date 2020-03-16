- RpiTracker Client
  must run on remote machine (raspberry pi) 
  
  Setup :
  - `cd client`
  - `yarn`
  -  edit client.js to change ip/domain and port of your server.
  - `node client.js`
  
  
- RpiTracker Server
  is a double server , websocket and express server.Express serving a minimal web interface
  wich displays all data gathered from websocket server.
  
  Setup :
  - `cd server`
  - `yarn`
  - make sure you change listening ports and username/passwords from defaults.
  * also ports must be allowed from server's firewall.
  - `node server.js`
  
  Default Settings :
   -  Web interface port : `3000`
   -  WebosocketServer port : `8080`
   -  Admin username/pass : `admin` `changeme`
