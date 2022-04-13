import {PlusCircleIcon, ReplyIcon} from '@heroicons/react/outline';
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {PropSchemaDesignerState} from '../../pages/schema';
import {ErrorAlerts} from '../libs/ErrorAlerts';
import AddProperty from './AddProperty';
import JsonToJsonSchema from './JsonToJsonSchema';
import SaveSchema from './SaveSchema';
import SaveSchemaToProject from './SaveSchemaToProject';
import SchemaPropertyItem from './SchemaPropertyItem';

type Props = {
  schemaDesignerState: PropSchemaDesignerState;
  setSchemaDesignerState: Dispatch<SetStateAction<PropSchemaDesignerState>>;
};

const SchemaDesigner = ({
  schemaDesignerState,
  setSchemaDesignerState,
}: Props) => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openJsonToJsonSchema, setOpenJsonToJsonSchema] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [saveSchemaToPrj, setSaveSchemaToPrj] = useState(false);
  const [saveSchema, setSaveSchema] = useState(false);

  const [schemaData, setSchemaData] = useState(schemaDesignerState.jsonSchema);
  const schemaType = schemaData['type'] || null;
  const numOfSchemaProperties = schemaData['properties']
    ? Object.getOwnPropertyNames(schemaData['properties']).length || 0
    : null;

  useEffect(() => {
    global.ipcRenderer.addListener('openJsonFile', (_event, args) => {
      const {datas} = args;
      try {
        setSchemaData(JSON.parse(datas));
      } catch (e) {
        setErrorAlert(true);
        setTimeout(() => {
          setErrorAlert(false);
        }, 1000);
        return false;
      }
    });
    global.ipcRenderer.addListener('exportJsonFile', (_event, args) => {
      if (args) {
        console.log('success');
      }
    });

    global.ipcRenderer.addListener('saveSchemaToProject', (_event, data) => {
      if (data) {
        setSaveSchema(true);
        setTimeout(() => {
          setSaveSchema(false);
        }, 3000);
      }
    });

    return () => {
      global.ipcRenderer.removeAllListeners('openJsonFile');
      global.ipcRenderer.removeAllListeners('exportJsonFile');
      global.ipcRenderer.removeAllListeners('saveSchemaToProject');
    };
  }, []);

  const addProperty = () => {
    setOpenAdd(true);
  };
  const clearJsonSchema = () => {
    console.log('clear');
    setSchemaData({
      $schema: 'http://json-schema.org/draft-04/schema#',
      type: 'object',
      properties: {},
      required: [],
    });
  };
  const exportSchema = () => {
    global.ipcRenderer.send('exportJsonFile', schemaData);
  };

  const loadJsonSchema = () => {
    global.ipcRenderer.send('openJsonFile');
  };

  const jsonToJsonSchema = () => {
    setOpenJsonToJsonSchema(true);
  };
  const saveSchemaToProject = () => {
    global.ipcRenderer.send('saveSchemaToProject', {
      id: schemaDesignerState.projectId,
      schema: schemaData,
      filename: schemaDesignerState.schemaFileName,
    });
  };

  const moveSchemaMain = () => {
    setSchemaDesignerState({
      projectId: null,
      schemaFileName: null,
      schemaFilePath: null,
      state: 'init',
    });
  };

  return (
    <>
      <div className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between ">
        <div className="flex-1 min-w-0 flex flex-row">
          <button className="ml-2 mr-4" onClick={moveSchemaMain}>
            <ReplyIcon className="h-4 w-4" />
          </button>
          <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate">
            {schemaDesignerState.schemaFileName}
          </h1>
        </div>
        <div className="mt-4 flex sm:mt-0 sm:ml-4">
          <button
            type="button"
            onClick={clearJsonSchema}
            className=" order-2 inline-flex items-center px-3 py-1.5 border border-blue-200 shadow-sm text-sm font-medium rounded-r-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
          >
            초기화
          </button>
          <button
            type="button"
            onClick={jsonToJsonSchema}
            className="order-1 inline-flex items-center px-3 py-1.5 border border-blue-200 shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none "
          >
            샘플 변환
          </button>
          <button
            type="button"
            onClick={loadJsonSchema}
            className="order-0 ml-3 inline-flex items-center px-3 py-1.5 border border-blue-200 shadow-sm text-sm font-medium rounded-l-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none  sm:ml-3"
          >
            불러오기
          </button>
          <button
            type="button"
            className="order-4  inline-flex items-center px-3 py-1.5 border border-blue-200 shadow-sm text-sm font-medium rounded-r-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none "
            onClick={exportSchema}
          >
            내보내기
          </button>
          <button
            type="button"
            onClick={saveSchemaToProject}
            className="order-3 ml-3 inline-flex items-center px-3 py-1.5 border border-blue-200 shadow-sm text-sm font-medium rounded-l-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none  sm:ml-3"
          >
            저장
          </button>
        </div>
      </div>

      {errorAlert ? (
        <ErrorAlerts errorMessage="Json 형식이 아닙니다. Json 파일을 다시 선택하세요." />
      ) : null}
      <div className=" m-2 px-4 py-2 flex flex-col border-2 rounded-md">
        <div className="py-1 flex justify-between">
          <div className="flex gap-x-2 items-end">
            <div className="text-xl">Root</div>
            <div>({numOfSchemaProperties})</div>
            <div className="font-bold text-sm">{schemaType}</div>
          </div>
          <div className="flex gap-x-4">
            <button
              className="border border-blue-200 inline-flex items-center text-sm shadow-sm font-medium rounded-md px-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-orange-500 "
              onClick={addProperty}
            >
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add
            </button>
          </div>
        </div>
        {schemaData['properties']
          ? Object.getOwnPropertyNames(schemaData['properties']).map(
              (property, key) => (
                <SchemaPropertyItem
                  key={key}
                  property={schemaData.properties[property]}
                  parent={[]}
                  name={property}
                  required={
                    schemaData.required
                      ? schemaData.required.find(
                          required => required == property,
                        )
                        ? true
                        : false
                      : false
                  }
                  setSchemaData={setSchemaData}
                  schemaData={schemaData}
                />
              ),
            )
          : null}

        {openAdd ? (
          <AddProperty
            openAdd={openAdd}
            setOpenAdd={setOpenAdd}
            parent={[]}
            setSchemaData={setSchemaData}
            schemaData={schemaData}
          />
        ) : null}

        {openJsonToJsonSchema ? (
          <JsonToJsonSchema
            openEdit={openJsonToJsonSchema}
            setOpenEdit={setOpenJsonToJsonSchema}
            setSchemaData={setSchemaData}
          />
        ) : null}

        {saveSchema ? (
          <SaveSchema
            setSaveSchema={setSaveSchema}
            projectId={schemaDesignerState.projectId}
          />
        ) : // <SaveSchemaToProject
        //   openEdit={saveSchemaToPrj}
        //   setOpenEdit={setSaveSchemaToPrj}
        //   schemaData={schemaData}
        // />
        null}
      </div>
    </>
  );
};

export default SchemaDesigner;
