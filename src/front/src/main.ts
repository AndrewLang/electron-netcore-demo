
import { app, BrowserWindow } from 'electron';
import { spawn } from 'child_process';
import * as glob from 'glob';
import * as path from 'path';
import * as os from 'os';
import { WebSocketClient } from './websocket/websocket_client';
import { Logger } from './common/Logger';


let mainWindow;
let logger = new Logger('Main');

async function startServer() {
    return new Promise((resolve, reject) => {
        try {
            let serverPath = `${__dirname}/server/Server.dll`;
            let cmd = `dotnet`;

            let app = spawn(cmd, [serverPath]);

            app.stdout.on('data', (data) => {
                let text = data.toString('utf8');
                logger.debug('[From WebSocket server] ', text);
            });
            app.stderr.on('data', (data) => {
                logger.error('WebSocket server error: ', data);
            });
            app.on('close', (code) => {
                logger.debug(`WebSocket server exited with code ${code}`);
            });

            console.log(`Backend server started with: `, cmd, serverPath);

            setTimeout(() => {
                resolve();
            }, 2000);

        } catch (err) {
            console.log(`Start backend server with error: `, err);
            reject(err);
        }
    });
}

async function sendMessage() {
    let port = 8964;
    let url = `ws://localhost:${port}/ws`;
    let client = new WebSocketClient(url);
    let data = { name: 'echo', body: { content: 'Hello world' } };
    let message = { name: 'invoke', payload: data };

    global['WebSocketClient'] = client;

    await client.start();

    let response = await client.invoke(message);

    logger.debug('Response', response);
}
async function createWindow() {
    let basePath = __dirname;
    mainWindow = new BrowserWindow({
        title: 'Electron.Net Core',
        icon: `${basePath}/assets/icons/netcore.png`,
        maximizable: false,
        minimizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    console.log('base path:', basePath);
    mainWindow.loadURL(`file://${basePath}/index.html`);

    mainWindow.show();

    /** start back-end server */
    await startServer();

    /** Connection to server through websocket */
    await sendMessage();
}

function initialize() {

    loadModules();

    app.on('ready', createWindow);

    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
}

function loadModules() {
    try {
        // let osPath = os.platform();
        // let dir = path.join(__dirname, `dist/${osPath}/*.js`);

        // let files = glob.sync(dir);
        // files.forEach(function (file) {
        //     console.log(`Load file: ${file}`);
        //     require(file);
        // });
    } catch (error) {
        console.log(error);
    }
};


// Handle Squirrel on Windows startup events
switch (process.argv[1]) {
    case '--squirrel-install':
        // autoUpdater.createShortcut(function () { app.quit() });
        break
    case '--squirrel-uninstall':
        // autoUpdater.removeShortcut(function () { app.quit() })
        break
    case '--squirrel-obsolete':
    case '--squirrel-updated':
        app.quit()
        break
    default:
        initialize()
}