// Native
import {join} from 'path';
import {format} from 'url';
import fs from 'fs';
import {exec} from 'child_process';
import * as iconv from 'iconv-lite';

//const detectEncoding = require("detect-onebyte-encoding");
// Packages
import {
  BrowserWindow,
  app,
  ipcMain,
  IpcMainEvent,
  dialog,
  shell,
  // remote,
} from 'electron';
import isDev from 'electron-is-dev';
import prepareNext from 'electron-next';

const isWin = process.platform === 'win32';

let mainWindow: any;
// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer');

  console.log('ready');

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: join(__dirname, 'preload.js'),
    },
    // autoHideMenuBar: true,
  });
  mainWindow.setMenuBarVisibility(false);

  const url = isDev
    ? 'http://localhost:8000/'
    : format({
        pathname: join(__dirname, '../renderer/out/index.html'),
        protocol: 'file:',
        slashes: true,
      });

  mainWindow.loadURL(url);
});

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit);

ipcMain.on('projectRead', (event: IpcMainEvent) => {
  const projectFile = `${process.resourcesPath}/project.json`;

  if (fs.existsSync(projectFile)) {
    fs.readFile(projectFile, 'utf8', (err, data) => {
      if (err) throw err;
      event.sender.send('projectRead', JSON.parse(data));
    });
  } else {
    event.sender.send('projectRead', '');
  }
});

ipcMain.on('showFile', (_: IpcMainEvent, path: string) => {
  // Open a file with the OS's default execution program
  if (isWin) {
    shell.openPath(path.replace('/', '\\'));
  } else {
    shell.openPath(path);
  }
});

ipcMain.on('projectWrite', (event: IpcMainEvent, projectLists: string) => {
  const projectFile = `${process.resourcesPath}/project.json`;
  fs.writeFile(projectFile, JSON.stringify(projectLists, null, 2), err => {
    if (err) throw err;
    event.sender.send('projectWrite', true);
  });
});

ipcMain.on('projectSchemaList', (event: IpcMainEvent, projectId: string) => {
  const schemaDir = `${process.resourcesPath}/datas/project/${projectId}/schema`;

  mkdir(schemaDir);
  fs.readdir(schemaDir, (err, files) => {
    if (err) throw err;
    event.sender.send('projectSchemaList', files);
  });
});

ipcMain.on(
  'exportXlsxFile',
  (event: IpcMainEvent, reqData: {projectId: number; jobId: number}) => {
    const {projectId, jobId} = reqData;
    const projectJson = `${process.resourcesPath}/project.json`;

    const projectData: {datas: {id: number; title: string}[]} = fs.existsSync(
      projectJson,
    )
      ? JSON.parse(fs.readFileSync(projectJson, 'utf8'))
      : {datas: []};

    const selectProject: {id: number; title: string} | undefined =
      projectData.datas.find(prj => prj.id === projectId);
    const projectTitle = selectProject ? selectProject.title : 'untitled';

    const saveFileName = `${projectTitle}_${jobId}`;

    dialog
      .showSaveDialog({
        defaultPath: saveFileName,
        filters: [{name: 'Excel File', extensions: ['xlsx']}],
      })
      .then(result => {
        if (result.filePath) {
          const xlsxPath = `${process.resourcesPath}/datas/project/${projectId}/xlsx/${jobId}.xlsx`;

          fs.copyFile(xlsxPath, result.filePath, err => {
            if (err) throw err;
            console.log(`${xlsxPath} was copied to ${result.filePath}`);
            event.sender.send('exportXlsxFile', true);
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
);

ipcMain.on('exportJsonFile', (event: IpcMainEvent, exportData: string) => {
  dialog
    .showSaveDialog({
      filters: [{name: 'Schema', extensions: ['json']}],
    })
    .then(result => {
      if (result.filePath) {
        fs.writeFile(
          result.filePath,
          JSON.stringify(exportData, null, 2),
          err => {
            if (err) throw err;
            event.sender.send('exportJsonFile', true);
          },
        );
      }
    })
    .catch(err => {
      console.log(err);
    });
});

ipcMain.on('readJsonFile', (event: IpcMainEvent, readFilePath: string) => {
  if (fs.existsSync(readFilePath)) {
    // console.log(readFilePath + ' file exists');
    fs.readFile(readFilePath, 'utf8', (err, data) => {
      if (err) throw err;
      event.sender.send('readJsonFile', JSON.parse(data));
    });
  } else {
    event.sender.send('readJsonFile', 'running');
  }
});

ipcMain.on('openJsonFile', (event: IpcMainEvent) => {
  dialog
    .showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [{name: 'JsonData', extensions: ['json']}],
    })
    .then(result => {
      const {canceled, filePaths} = result;
      if (!canceled) {
        fs.readFile(filePaths[0], 'utf8', (err, data) => {
          if (err) throw err;
          event.sender.send('openJsonFile', {
            datas: data,
          });
        });
      }
    });
});

type selectSchemaFile = {
  fileName: string;
  id: string;
};

ipcMain.on(
  'selectSchemaFile',
  (event: IpcMainEvent, datas: selectSchemaFile) => {
    const {fileName, id} = datas;
    const schemaFileDir = `${process.resourcesPath}/datas/project/${id}/schema/${fileName}`;
    fs.readFile(schemaFileDir, 'utf8', (err, data) => {
      if (err) throw err;
      event.sender.send('selectFilePath', {
        inputType: 'schemaFilePath',
        dirPath: fileName,
        datas: data,
      });
    });
  },
);

ipcMain.on('selectFilePath', (event: IpcMainEvent, inputType: string) => {
  if (inputType === 'datasetPath') {
    dialog
      .showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
      })
      .then(result => {
        const {canceled, filePaths} = result;
        if (!canceled) {
          let filePath = filePaths[0];
          if (isWin) {
            filePath = iconv.decode(Buffer.from(filePaths[0]), 'euc-kr');
          }
          event.sender.send('selectFilePath', {
            inputType,
            dirPath: filePath,
            datas: '',
          });
        }
      });
  } else if (inputType === 'schemaFilePath') {
    dialog
      .showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [{name: 'Schema', extensions: ['json', 'xsd']}],
      })
      .then(result => {
        const {canceled, filePaths} = result;
        if (!canceled) {
          let filePath = filePaths[0];
          if (isWin) {
            filePath = iconv.decode(Buffer.from(filePaths[0]), 'euc-kr');
          }
          fs.readFile(filePaths[0], 'utf8', (err, data) => {
            if (err) throw err;
            event.sender.send('selectFilePath', {
              inputType,
              dirPath: filePath,
              datas: data,
            });
          });
        }
      });
  }
});

function mkdir(dirPath: string) {
  const isExists = fs.existsSync(dirPath);
  if (!isExists) {
    fs.mkdirSync(dirPath, {recursive: true});
  }
}
type jobDataProp = {
  id: string;
};

ipcMain.on('jobList', (event: IpcMainEvent, jobjson: jobDataProp) => {
  const {id: projectId} = jobjson;
  const jobJson = `${process.resourcesPath}/datas/project/${projectId}/job.json`;
  const isExists = fs.existsSync(jobJson);
  if (!isExists) {
    event.sender.send('jobList', {
      jobs: [],
    });
  } else {
    fs.readFile(jobJson, 'utf8', (err, data) => {
      if (err) throw err;
      event.sender.send('jobList', JSON.parse(data));
    });
  }
});

type SchemaFileCheckProp = {
  projectId: number;
  schemaName: string;
};

ipcMain.on(
  'projectSchemaFileCheck',
  (event: IpcMainEvent, {projectId, schemaName}: SchemaFileCheckProp) => {
    const schemaDir = `${process.resourcesPath}/datas/project/${projectId}/schema/`;

    mkdir(schemaDir);
    fs.readdir(schemaDir, (error, files) => {
      if (error) {
        console.log(error);
        return;
      }
      if (files.length === 0) {
        event.sender.send('projectSchemaFileCheck', true);
      } else {
        const isExistFile = files.find(file => file == `${schemaName}.json`);
        console.log(isExistFile);
        if (isExistFile) {
          event.sender.send('projectSchemaFileCheck', false);
        } else {
          event.sender.send('projectSchemaFileCheck', true);
        }
      }
      console.log(files);
    });
  },
);

ipcMain.on('getProjectTitle', (event: IpcMainEvent, projectId: number) => {
  const projectJson = `${process.resourcesPath}/project.json`;

  fs.readFile(projectJson, 'utf8', (err, data) => {
    if (err) throw err;
    const {datas: projectLists} = JSON.parse(data);
    if (Array.isArray(projectLists)) {
      const findProject = projectLists.find(project => project.id == projectId);
      if (findProject) {
        event.sender.send('getProjectTitle', findProject.title);
      }
    }
  });
});
ipcMain.on('projectSchemaLists', (event: IpcMainEvent, projectId: number) => {
  const schemaDir = `${process.resourcesPath}/datas/project/${projectId}/schema/`;

  fs.readdir(schemaDir, (error, files) => {
    if (error) {
      return;
    }
    event.sender.send('projectSchemaLists', files);
  });
});

ipcMain.on(
  'loadSchemaToProject',
  (event: IpcMainEvent, projectId, filename) => {
    // const {id: projectId, schema, filename} = inputjson;
    const schemaDir = `${process.resourcesPath}/datas/project/${projectId}/schema`;
    const schemaFilePath = schemaDir + '/' + filename;
    // mkdir(schemaDir);
    fs.readFile(schemaFilePath, 'utf-8', (err, data) => {
      if (err) throw err;
      event.sender.send('loadSchemaToProject', JSON.parse(data), filename);
    });
  },
);

ipcMain.on('projectDelete', (event: IpcMainEvent, projectId: string) => {
  const projectDir = `${process.resourcesPath}/datas/project/${projectId}/`;
  const projectFile = `${process.resourcesPath}/project.json`;

  fs.readFile(projectFile, 'utf8', (err, data) => {
    if (err) throw err;
    const {datas: projectLists} = JSON.parse(data);
    if (Array.isArray(projectLists)) {
      const filteredProject = projectLists.filter(function (project) {
        return project.id != parseInt(projectId);
      });
      fs.writeFile(
        projectFile,
        JSON.stringify({datas: filteredProject}, null, 2),
        err => {
          if (err) throw err;
          event.sender.send('projectWrite', true);
          fs.rm(projectDir, {recursive: true, force: true}, err => {
            if (err) throw err;
            event.sender.send('projectDelete', true);
          });
        },
      );
    }
  });
});

ipcMain.on('saveSchemaToProject', (event: IpcMainEvent, inputjson: any) => {
  const {id: projectId, schema, filename} = inputjson;
  const schemaDir = `${process.resourcesPath}/datas/project/${projectId}/schema`;
  const schemaFilePath = schemaDir + '/' + filename;
  mkdir(schemaDir);
  fs.writeFile(schemaFilePath, JSON.stringify(schema, null, 2), err => {
    if (err) throw err;
    event.sender.send('saveSchemaToProject', true);
  });
});

type inputDataProp = {
  id: string;
  input: {
    target_directory: string;
    data_type: string;
    schema_file: string;
    schema_property: {
      selector: string;
      value_list: string;
    }[];
    project_name?: string;
    job_number?: string;
  };
};
ipcMain.on('Input_Json', (event, Input_Json:JSON) => {
  console.log("pong",JSON.stringify(Input_Json));
  event.reply('Input_Json',Input_Json);
  run_console(Input_Json);
 })

const run_console=(Input_Json: JSON)=>{
console.log(JSON.stringify(Input_Json));
}

ipcMain.on('inputdata', (event: IpcMainEvent, inputjson: inputDataProp) => {
  const {id: projectId, input: inputjsondata} = inputjson;
  const runFile = join(process.resourcesPath, 'extraResources', 'main');
  const inputJson = `${process.resourcesPath}/input.json`;
  const projectJson = `${process.resourcesPath}/project.json`;

  const jobJson = `${process.resourcesPath}/datas/project/${projectId}/job.json`;
  const jobJsonData = fs.existsSync(jobJson)
    ? JSON.parse(fs.readFileSync(jobJson, 'utf8'))
    : {jobs: []};

  const schemaFileDir = `${process.resourcesPath}/datas/project/${projectId}/schema/${inputjsondata.schema_file}`;

  const newJobId = jobJsonData.jobs.length;

  const projectData: {datas: {id: number; title: string}[]} = fs.existsSync(
    projectJson,
  )
    ? JSON.parse(fs.readFileSync(projectJson, 'utf8'))
    : {datas: []};

  const selectProject: {id: number; title: string} | undefined =
    projectData.datas.find(prj => prj.id === parseInt(projectId));
  const projectTitle = selectProject ? selectProject.title : 'untitled';

  let newInputJsonData = inputjsondata;
  newInputJsonData.project_name = projectTitle;
  newInputJsonData.job_number = `${newJobId}`;
  newInputJsonData.schema_file = schemaFileDir;

  mkdir(`${process.resourcesPath}/datas/project/${projectId}`);
  fs.writeFile(inputJson, JSON.stringify(inputjsondata, null, 2), err => {
    if (err) throw err;
    const outputPath = `${process.resourcesPath}/output.json`;
    if (fs.existsSync(outputPath)) {
      fs.unlink(outputPath, err => {
        if (err) throw err;
      });
    }

    const createResultDate = Date.now();
    const resultFilePath = `${process.resourcesPath}/datas/project/${projectId}/result/output_${createResultDate}.json`;

    let newJob: {
      id: any;
      status: string;
      date: number;
      resultfilePath?: string;
      errMsg?: string;
    } = {
      id: newJobId,
      status: 'running',
      date: createResultDate,
      resultfilePath: resultFilePath,
    };

    event.sender.send('jobStatus', newJob);
    jobJsonData.jobs.push(newJob);
    fs.writeFileSync(jobJson, JSON.stringify(jobJsonData, null, 2));
    event.sender.send('jobList', jobJsonData);

    console.log('start main.exe');
    const prjResultPath = `${process.resourcesPath}/datas/project/${projectId}/result/`;
    mkdir(prjResultPath);

    const xlsxPath = `${process.resourcesPath}/${inputjsondata.project_name}${inputjsondata.job_number}.xlsx`;
    const xlsxResultPath = `${process.resourcesPath}/datas/project/${projectId}/xlsx/`;
    const xlsxResultFilePath = `${process.resourcesPath}/datas/project/${projectId}/xlsx/${inputjsondata.job_number}.xlsx`;
    mkdir(xlsxResultPath);

    exec(runFile + ' ' + process.resourcesPath, (error, _, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        event.sender.send('inputdata', error.message);
        newJob.status = 'failed';
        newJob.errMsg = error.message;
        // event.sender.send('jobStatus', newJob);
        jobJsonData.jobs.pop();
        jobJsonData.jobs.push(newJob);
        fs.writeFileSync(jobJson, JSON.stringify(jobJsonData, null, 2));

        event.sender.send('jobList', jobJsonData);

        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        event.sender.send('inputdata', stderr);
        newJob.status = 'failed';
        newJob.errMsg = stderr;
        // event.sender.send('jobStatus', newJob);
        jobJsonData.jobs.pop();
        jobJsonData.jobs.push(newJob);
        fs.writeFileSync(jobJson, JSON.stringify(jobJsonData, null, 2));
        event.sender.send('jobList', jobJsonData);

        return;
      }

      if (fs.existsSync(xlsxPath)) {
        fs.renameSync(xlsxPath, xlsxResultFilePath);
      }

      if (fs.existsSync(outputPath)) {
        fs.copyFileSync(outputPath, resultFilePath);
      } else {
        event.sender.send('inputdata', "output.json doesn't exist");
      }
      // event.sender.send('inputdata', stdout);
      event.sender.send('inputdata', 'success');

      newJob.status = 'success';
      event.sender.send('jobStatus', newJob);

      jobJsonData.jobs.pop();
      jobJsonData.jobs.push(newJob);
      event.sender.send('jobList', jobJsonData);

      fs.writeFileSync(jobJson, JSON.stringify(jobJsonData, null, 2));
    });
  });
});
