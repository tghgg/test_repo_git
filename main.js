const {app, BrowserWindow, ipcRenderer, ipcMain} = require('electron')
const util = require('util')
const fs = require('fs')
const stat = util.promisify(fs.stat)
const path = require('path')

let mainWindow
app.on('ready', function() {
  const htmlPath = path.join('src', 'index.html')
  mainWindow = new BrowserWindow({webPreferences: {nodeIntegration: true}})
  mainWindow.loadFile(htmlPath)
})
ipcMain.on('files', async (event, filesArr) => {
  try {
    //asynchronously get all the data for the files
    const data = await Promise.all(
      filesArr.map(async ({name, pathName}) => ({
        ...await stat(pathName),
        name,
        pathName
      }))
    )

    //remember we declared mainWindow ourselves
    //when we created a new BrowserWindow
    mainWindow.webContents.send('metadata', data)
  } catch (error) {
    //send an error event if things go wrong
    mainWindow.webContents.send('metadata:error',  error)
  }
})
