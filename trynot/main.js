/* 
This application was created from the following video.
https://www.youtube.com/watch?v=kN1Czs0m1SU

Debugging can be enabled by setting up a launch.json file as per
This has not been implemented in this project. 
http://electron.rocks/debugging-electron-in-vs-code/
*/

const electron = require('electron');
const {ipcRenderer, Tray} = electron;
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

process.env.NODE_ENV = 'production';
let mainWindow;
let addWindow;

const myIcon = path.join(__dirname, "assets/icons/png/icon.png");

app.on('ready', function (){    
    mainWindow = new BrowserWindow({show: false});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('closed', function(){
        app.quit();
    })
    
    tray = new Tray(myIcon);

    tray.on("click", function (event) {

        mainWindow.webContents.send('item:notify', "Item addded from tray");

      });


    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

const mainMenuTemplate = [
    {
        label: '&File',
        submenu:[
            {
                label: 'Add Item',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items',
                click(){
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }             
        ]
    }
];

// If mac, add empty object to menu
if (process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}

// Add developer tools item if not in prod
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
    
}