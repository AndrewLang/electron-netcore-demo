# electron-netcore-demo

> None production code, just prove the ideas behind it. Only tested on Windows 10. 

This is a demo of combine .Net Core and Electron for a desktop application. .Net core app is an ASP.Net core application which works as a web server, Electron app plays as a GUI of the application, GUI talk to the server through WebSocket. I am pretty this way will work, just want to see how difficult to create a prototype.

The reasons adopt WebSocket instead of other IPCs

* WebSocket is duplex communication which can meet what I want
* .Net developer can focus on the backend
* GUI developer can focus on the frontend
* It is possible to move the backend to a real web server and provide services to clients
* It is possible to make the backend as a CLI app which other apps can work with without the GUI
* It is possible to make the frontend a browser application without hosted in electron

## Instructions

### Build backend

Backend locate at /src/back/server, it is a .Net Core 3 application, you need .Net Core 3.0 SDK or above to compile it. If you prefer VS, then VS 2019 is needed.

After compiled the backend, a folderr "dist/server" will be created and "Server.dll", "Server.runtimeconfig.json" should be in this folder.

### Build frontend

Frontend locate at /src/front, it is a node/electron application, run `npm start` will compile and start the electron app. If everything works fine, you will see an electron app started.


