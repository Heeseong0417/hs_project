import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import JsonViewer from '../schema/jsonviewer';
import CheckBoxButton from './button/CheckBoxButton';
import DataSetPathSelectButton from './button/DataSetPathSelectButton';
import ListSelectButton from './button/ListSelectButton';
import PathSelectButton from './button/PathSelectButton';
{
  /* Top section */
}
export type ValidationInputs = {
  target_server: string;
  data_type: string;
  target_directory: string;
  schema_file: string;
  file_validate: boolean;
  property_validate: boolean;
  schema_validate: boolean;
  classElement: string;
  // classElements: any;
};

export type PropClassElements = {
  path: string;
  value: string;
  type: string;
  option?: object;
};

type Props = {
  projectId: string | string[];
  setSelectJobId: Dispatch<SetStateAction<string | string[]>>;
  projectTitle: string | string[];
};

const TestMainList = ({projectId, setSelectJobId, projectTitle}: Props) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: {errors},
  } = useForm<ValidationInputs>({mode: 'onChange'});

  const [schemaJson, setSchemaJson] = useState(null);
  const [classElements, setClassElements] = useState<PropClassElements[]>([]);
  const [stdOut, setStdOut] = useState('');

  useEffect(() => {
    global.ipcRenderer.addListener('selectFilePath', (_event, args) => {
      const {inputType, dirPath, datas} = args;

      if (inputType === 'datasetPath') {
        setValue('target_directory', dirPath);
      } else if (inputType === 'schemaFilePath') {
        setValue('schema_file', dirPath);
        // console.log(JSON.parse(datas));
        setSchemaJson(JSON.parse(datas));
      }
    });

    global.ipcRenderer.addListener('inputdata', (_event, args) => {
      setStdOut(args);
      console.log(args);
    });

    global.ipcRenderer.addListener('jobStatus', (_event, args) => {
      // setStdOut(args);
      setSelectJobId(args.id);
      if (args.status === 'running') {
        console.log(args);
      }
    });

    return () => {
      global.ipcRenderer.removeAllListeners('selectFilePath');
      global.ipcRenderer.removeAllListeners('inputdata');
      global.ipcRenderer.removeAllListeners('jobStatus');
    };
  }, []);

  useEffect(() => {
    setValue('classElement', JSON.stringify(classElements));
  }, [classElements]);

  const onSubmit = ({
    target_directory,
    data_type,
    schema_file,
    classElement,
  }) => {
    // console.log(data);
    const classObj = JSON.parse(classElement);
    // console.log(classObj);
    // const selector = classObj[0].path.replaceAll('/', '.').substr(1);
    const schema_property = classObj.map(cl => ({
      selector: cl.path.replaceAll('/', '.').substr(1),
      value_list: cl.value,
      type: cl.type,
    }));

    if (!data_type) {
      data_type = 'json';
    }

    console.log({
      target_directory,
      data_type,
      schema_file,
      schema_property,
    });

    global.ipcRenderer.send('inputdata', {
      id: projectId,
      input: {
        target_directory,
        data_type,
        schema_file,
        schema_property,
      },
    });
  };

  return (
    <ul role="list" className="py-4 px-6 space-y-4 overflow-auto">
      <li className="bg-white py-6 shadow rounded-lg px-6">
        <div className="space-y-8 divide-y divide-gray-200">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 divide-y divide-gray-200"
          >
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-6">
              <div className="sm:col-span-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  시험 검증 기본 설정
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  AI 데이터 검증을 위한 데이터셋과 스키마를 선택합니다.
                </p>
              </div>
              {/* select target_server */}
              {/* <div className="col-span-6 sm:col-span-3">
                <ListSelectButton
                  title="테스트 서버 설정"
                  register={register}
                  register_name="target_server"
                  options={['Local']}
                />
              </div> */}
              {/* select data_type */}
              {/* <div className="col-span-6 sm:col-span-3">
                <ListSelectButton
                  title="데이터셋 포멧"
                  register={register}
                  register_name="data_type"
                  options={['json']}
                />
              </div> */}
              {/* select selectFilePath */}
              <div className="col-span-6">
                <PathSelectButton
                  title="스키마 파일 경로 선택"
                  register={register}
                  register_name="schema_file"
                  ipcSendString="schemaFilePath"
                  setValue={setValue}
                />
              </div>
              {/* select dataset-dirpath */}
              <div className="col-span-6">
                <DataSetPathSelectButton
                  title="데이터 셋 경로 선택"
                  register={register}
                  register_name="target_directory"
                  ipcSendString="datasetPath"
                  setValue={setValue}
                />
              </div>

              {/* select testType */}
              <div className="col-span-6">
                <fieldset>
                  <legend className="text-base font-medium text-gray-900">
                    시험 검사
                  </legend>
                  <div className="mt-4 space-y-4">
                    <CheckBoxButton
                      title="파일 통계"
                      description=" 파일 통계 검사를 수행합니다."
                      register={register}
                      register_name="file_validate"
                    />
                    <CheckBoxButton
                      title="프로퍼티 통계"
                      description="프로퍼티 통계 검사를 수행합니다."
                      register={register}
                      register_name="property_validate"
                    />
                    <CheckBoxButton
                      title="구문 정확성"
                      description="선택한 스키마 파일을 바탕으로 데이터셋의 구문 정확성
                      검사를 수행합니다."
                      register={register}
                      register_name="schema_validate"
                    />
                  </div>
                </fieldset>
              </div>
              {/* select selectFilePath */}
              <div className="col-span-6">
                <label
                  htmlFor="selectFilePath"
                  className="block text-sm font-medium text-gray-700"
                >
                  통계적 다양성 - 클래스 엘리먼트 생성
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    {...register('classElement', {
                      required: true,
                    })}
                    type="text"
                    className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 hidden w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                  />
                </div>

                {schemaJson ? (
                  <JsonViewer
                    schemaJson={schemaJson}
                    classElements={classElements}
                    setClassElements={setClassElements}
                  />
                ) : (
                  <div className="m-4 flex justify-center items-center">
                    <h2>스키마 파일을 선택하세요.</h2>
                  </div>
                )}

                <div>
                  <div className="whitespace-pre">{stdOut}</div>
                </div>
                <div className="col-span-6 flex justify-end my-4">
                  <div className="">
                    <button
                      type="submit"
                      className="order-0 w-28 text-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:order-1 sm:ml-3"
                    >
                      제출
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </li>
    </ul>
  );
};

export default TestMainList;
