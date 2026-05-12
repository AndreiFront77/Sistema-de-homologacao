const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

// Detectar se está em desenvolvimento
const isDev = process.env.NODE_ENV === 'development' || 
              !app.isPackaged || 
              process.argv.includes('--dev');

/**
 * Inicia o servidor backend Node.js local
 */
function startBackend() {
  return new Promise((resolve, reject) => {
    const backendPath = path.join(__dirname, '../local-backend');
    const isWindows = process.platform === 'win32';
    
    console.log('[Electron] Iniciando backend em:', backendPath);

    // Inicia o servidor Node.js como processo filho
    backendProcess = spawn('node', ['server.js'], {
      cwd: backendPath,
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: false
    });

    let started = false;

    backendProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('[Backend]', output);
      
      // Confirma que o servidor está rodando
      if (output.includes('listening') && !started) {
        started = true;
        console.log('[Electron] Backend iniciado com sucesso');
        resolve();
      }
    });

    backendProcess.stderr.on('data', (data) => {
      console.error('[Backend Error]', data.toString());
    });

    backendProcess.on('error', (err) => {
      console.error('[Backend] Erro ao iniciar:', err);
      if (!started) {
        reject(err);
      }
    });

    backendProcess.on('exit', (code) => {
      console.log('[Backend] Processo finalizado com código:', code);
    });

    // Timeout de segurança
    setTimeout(() => {
      if (!started) {
        resolve(); // Resolve mesmo se não tiver confirmação (pode estar ok)
      }
    }, 5000);
  });
}

/**
 * Cria a janela principal
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../assets/icon.ico')
  });

  const startUrl = isDev
    ? 'http://localhost:4200'  // Dev: Angular serve
    : `file://${path.join(__dirname, '../dist/sistema-homologacao/index.html')}`; // Prod: build

  console.log('[Electron] Carregando URL:', startUrl);
  mainWindow.loadURL(startUrl);

  // Abrir DevTools em desenvolvimento
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Tratar erros de carregamento
  mainWindow.webContents.on('crashed', () => {
    dialog.showErrorBox('Erro', 'A aplicação encontrou um erro e será reiniciada.');
    app.relaunch();
    app.exit(0);
  });
}

/**
 * Cria o menu da aplicação
 */
function createMenu() {
  const template = [
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Sair',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Editar',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'Visualizar',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' }
      ]
    },
    {
      label: 'Ajuda',
      submenu: [
        {
          label: 'Sobre',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Sistema de Homologação',
              message: 'Sistema de Homologação v1.0.0',
              detail: 'Ferramenta local de homologação com persistência em SQLite.\n\nLocalizado em: ' + path.join(__dirname, '../')
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

/**
 * Evento: App pronto
 */
app.on('ready', async () => {
  try {
    // Inicia o backend
    await startBackend();
    
    // Aguarda um pouco para garantir que o backend está pronto
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Cria a janela
    createWindow();
    createMenu();
  } catch (err) {
    console.error('[Electron] Erro ao iniciar:', err);
    dialog.showErrorBox('Erro', 'Falha ao iniciar a aplicação: ' + err.message);
    app.quit();
  }
});

/**
 * Evento: App finalizado (Windows)
 */
app.on('window-all-closed', () => {
  console.log('[Electron] Todas as janelas fechadas');
  
  // Encerra o backend
  if (backendProcess) {
    console.log('[Electron] Encerrando backend...');
    backendProcess.kill();
  }

  // No macOS, mantém a app aberta até o usuário clicar explicitamente em Sair
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * Evento: App reativada (macOS)
 */
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Evento: Tratamento de erro não capturado
 */
process.on('uncaughtException', (err) => {
  console.error('[Electron] Erro não capturado:', err);
  dialog.showErrorBox('Erro Fatal', 'Um erro inesperado ocorreu: ' + err.message);
});
