import {useEffect, useState} from 'react';
import {VailentProject} from '..';
import {navigation} from '../../components/libs/menu';
import MainAside from '../../components/main/MainAside';
import SchemaDesigner from '../../components/schema/SchemaDesigner';
import SchemaProjectLists from '../../components/schema/SchemaProjectLists';

const initSchema = {
  type: 'object',
  properties: {},
  required: [],
};

export interface PropSchemaDesignerState {
  projectId: number | null;
  schemaFilePath: string | null;
  schemaFileName: string | null;
  state: string;
  jsonSchema?: any;
}

function SchemaMain() {
  const [projects, setProjects] = useState<VailentProject[]>([]);
  const [schemaDesignerState, setSchemaDesignerState] =
    useState<PropSchemaDesignerState>({
      projectId: null,
      schemaFilePath: null,
      schemaFileName: null,
      state: 'init',
    });
  navigation.forEach(nav =>
    nav.name === 'Schema' ? (nav.current = true) : (nav.current = false),
  );

  useEffect(() => {
    console.log('schema start');
    global.ipcRenderer.send('projectRead');
    global.ipcRenderer.addListener('projectRead', (_event, data) => {
      if (data) {
        const projects = data.datas;
        setProjects(projects);
      }
    });
    return () => {
      global.ipcRenderer.removeAllListeners('projectRead');
    };
  }, []);

  return (
    <div className="h-full">
      {/* Static sidebar for desktop */}
      <MainAside navigation={navigation} />
      {/* Main column */}
      <div className="pl-64 flex-col w-full h-full">
        {/* Search header */}

        {schemaDesignerState.projectId === null ? (
          <SchemaProjectLists
            projects={projects}
            setSchemaDesignerState={setSchemaDesignerState}
          />
        ) : (
          <SchemaDesigner
            schemaDesignerState={schemaDesignerState}
            setSchemaDesignerState={setSchemaDesignerState}
          />
        )}
      </div>
    </div>
  );
}

export default SchemaMain;
