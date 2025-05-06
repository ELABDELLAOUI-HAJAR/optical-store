const { app, BrowserWindow } = require('electron');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });


function createWindow() {
    const win = new BrowserWindow({
        width: 1900,
        height: 1000,   
        icon: path.join(__dirname, 'build', 'favicon.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            // Set a secure Content Security Policy
            webSecurity: true,
            contentSecurityPolicy: "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://wujydrowaehbzpwwwtxy.supabase.co; frame-src 'self';"
        },
    });

  //win.loadURL('http://localhost:3000'); // Load your React app (dev mode)
    win.loadFile(path.join(__dirname, 'build', 'index.html'));

    // Pass environment variables to the renderer process
    win.webContents.on('did-finish-load', () => {
        win.webContents.send('env-vars', {
            supabaseUrl: process.env.REACT_APP_SUPABASE_URL,
            supabaseKey: process.env.REACT_APP_SUPABASE_ANON_KEY,
        });
    });

    win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});