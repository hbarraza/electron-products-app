const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const url = require('url');
const path = require('path')

if (process.env.NODE_ENV !== 'production') {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    })    
}

let mainWindow;  //ventana principal
let newProductWindow //ventana producto

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            contextIsolation: false,
            enableRemoteModule: true      
        },
        icon: path.join(__dirname, 'assets/icons/png/package.png')
    });
    mainWindow.loadURL(path.join(__dirname, 'views/index.html'));

    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('closed', () => { app.quit(); })
});

function createNewProductWindow(){
    newProductWindow = new BrowserWindow(
        {
            width: 400,
            height: 450,
            title: "Add a new product",
            backgroundColor: '#2e2c29',
            icon: '../../assets/icons/png/icon.ico',
            webPreferences: {
                nodeIntegration: true,
                nodeIntegrationInWorker: true,
                contextIsolation: false,
                enableRemoteModule: true
            }
        }
    )

    //newProductWindow.setMenu(null);

    newProductWindow.loadURL(path.join(__dirname, 'views/new-product.html'),
        {
            protocol: 'file',
            slashes: true
        }
    );

    newProductWindow.on('closed', () => {
        newProductWindow = null
    });
}

ipcMain.on('product:new', (e, newProduct) => {
    console.log("desde main: ", newProduct)
    mainWindow.webContents.send('product:new', newProduct)
    newProductWindow.close();
})

const templateMenu = [
    {
        label: "File",
        submenu: [
            {
                label: "New Product",
                accelerator: "Ctrl+N",
                click(){
                    createNewProductWindow()
                }
            },
            {
                label: "Remove All Products",
                click(){
                    mainWindow.webContents.send('products:remove-all')
                }
            },
            {
                label: "Exit",
                accelerator: process.platform == "darwin" ? "command+Q":"Ctrl+Q",
                click(){
                    app.quit()
                }
            }
        ]
    }  
];

//Si es mac
if (process.platform === "darwin") {
    templateMenu.unshift({
        label: app.getName()
    })
}

//
if (process.env.NODE_ENV !== "production") {
    templateMenu.push({
        label: "DevTools",
        submenu: [
            {
                label: "Show/Hide Dev Tools",
                accelerator: "Ctrl+D",
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools()
                }
            },
            {
                role: "reload"
            }
        ]
    })
    
}