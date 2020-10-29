<div align="center"> <img src="https://raw.githubusercontent.com/Kos-M/RpiTracker/devel/docs/scema.png" width="50%">
</div> 

- RpiTracker Client
  must run on remote machine (raspberry pi) 
  
  Setup :
  - `cd client`
  - `yarn`
  -  edit .env to change ip/domain and port of your server.
  - `node client.js`
  
  
- RpiTracker Server
  is a double server , websocket and express server.Express serving a minimal web interface
  wich displays all data gathered from websocket server.

  Setup :
  - `cd server`
  - `yarn`
  - make sure you change listening ports and username/passwords from defaults in .env file 
  * also ports must be allowed from server's firewall.
  - `node server.js`
  
  Default Settings  (change them in .env ):
   -  Web interface port : `3000`
   -  WebosocketServer port : `8080`
   -  Admin username/pass : `admin` `changeme`
