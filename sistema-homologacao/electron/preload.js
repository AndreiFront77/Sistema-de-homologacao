const { contextBridge } = require('electron');

// Expor apenas APIs seguras para o renderer process
contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
  version: process.version,
  app: {
    name: 'Sistema de Homologação',
    version: '1.0.0'
  }
});
