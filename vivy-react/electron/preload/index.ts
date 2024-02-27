import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge } from 'electron'

// Custom APIs for renderer
const api = {}
export type API = typeof api

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('electron', electronAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  window.api = api
  window.electron = electronAPI
}
