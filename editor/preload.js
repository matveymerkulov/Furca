// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron')
const fs = require("fs")

contextBridge.exposeInMainWorld(
    'electron',
    {
        saveFile: (fileName, text) => {
            fs.writeFile(fileName, text, (err) => {
                if(err) alert(err.toString())
            })
        }
    }
)
