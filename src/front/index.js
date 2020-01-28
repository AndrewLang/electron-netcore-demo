
const { electron, app, Tray, BrowserWindow, Menu } = require('electron');
const ChildProcess = require('child_process');
const glob = require('glob')
const path = require('path')
const os = require('os');


global.__basedir = __dirname;

let mainWindow;
function createWindow() {
    let basePath = __dirname;
    mainWindow= new BrowserWindow({ title: 'Electron.Net Core', icon: `${basePath}/assets/icons/netcore.png`, maximizable: false, minimizable: false, show: false});

    console.log(basePath);
    mainWindow.loadURL(`file://${basePath}/index.html`);
    
    mainWindow.show();
}

function initialize() {
   
    loadModules();

    app.on('ready', createWindow);

    app.on('window-all-closed', function () { });
}

function loadModules() {
    try {
        let osPath = os.platform();
        let dir = path.join(__dirname, `dist/${osPath}/*.js`);

        let files = glob.sync(dir);
        files.forEach(function (file) {
            console.log(`Load file: ${file}`);
            require(file);
        });
    } catch (error) {
        console.log(error);
    }
};


// Handle Squirrel on Windows startup events
switch (process.argv[1]) {
    case '--squirrel-install':
        autoUpdater.createShortcut(function () { app.quit() });
        break
    case '--squirrel-uninstall':
        autoUpdater.removeShortcut(function () { app.quit() })
        break
    case '--squirrel-obsolete':
    case '--squirrel-updated':
        app.quit()
        break
    default:
        initialize()
}