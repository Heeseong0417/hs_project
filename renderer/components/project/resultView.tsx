import React, {useEffect, useState} from 'react';
import {JobListProp} from '../../pages/projects/[id]';
import ResultChart from './resultChart';
import ResultFailed from './resultFailed';
import ResultLoading from './resultLoading';
import ResultNavbar from './resultNavbar';
import ResultSchema from './resultSchema';
import ResultSummary from './resultSummary';
import ResultValue from './resultValue';

type Props = {
  jobId: string | string[];
  jobLists: JobListProp[];
};

export type Response = {
  target_directory: string;
  data_type: string;
  selector: string;
  schema_property: {
    selector: string;
    value_list: string;
    value_count: object;
    valid_value_count: object;
  }[];
  file_count: Object;
  'value list': string[];
  schema_path: string;
  elapsed_time: number;
  value_count: Object;
  valid_value_count: Object;
  valid_schema_count: Object;
  file_list: Object;
};

const StringsToNum = (str: string | string[]) => {
  let result: number;
  if (typeof str === 'string') {
    result = Number(str);
  } else {
    result = Number(str);
  }
  return result;
};

interface PropFileList {
  fileName?: string;
  valid_schema?: boolean;
  invalid_value?: boolean;
  schema_validation_msg?: string;
  selector?: string;
  msg?: string;
  result?: boolean;
  value?: string;
}

const getFilters = schema_property => {
  const selector = ['all'];
  Object.entries(schema_property).map(([key, value]) => {
    Object.entries(value).map(([key, value]) => {
      if (key == 'selector') {
        if (typeof value == 'string') {
          selector.push(value);
        }
      }
    });
  });
  return {
    selector,
    result: ['all', 'pass', 'fail'],
  };
};

const setFileLists = file_list => {
  const newValueValidationList = [];
  Object.entries(file_list).map(([key, value]) => {
    const file_list: any = {};
    // console.log(navigator);
    // file_list.fileName = key.split('./')[1];
    file_list.fileName = key.split('.\\')[1];
    // console.log('error start');
    // file_list.fileName = key;

    Object.entries(value).map(([key, value]) => {
      if (key == 'valid_schema') {
        if (typeof value == 'boolean') {
          file_list.valid_schema = value;
        }
      }
      if (key == 'schema_validation_msg') {
        if (typeof value == 'string') {
          file_list.schema_validation_msg = value;
        }
      }
      if (key == 'invalid_value') {
        if (typeof value == 'boolean') {
          file_list.invalid_value = value;
        }
      }
    });
    Object.entries(value).map(([key, value]) => {
      if (key == 'value_validation') {
        Object.entries(value).map(([key, value]) => {
          const newFileList = Object.assign({}, file_list);
          newFileList.selector = key;
          Object.entries(value).map(([key, value]) => {
            if (key == 'msg') {
              if (typeof value == 'string') {
                newFileList.msg = value;
              }
            }
            if (key == 'result') {
              if (typeof value == 'boolean') {
                newFileList.result = value;
              }
            }
            if (key == 'value') {
              // if (typeof value == 'string') {
              newFileList.value = value;
              // }
            }
          });
          // console.log(newFileList);
          newValueValidationList.push(newFileList);
        });
      }
    });
  });
  // console.log(newValueValidationList);
  return newValueValidationList;
};

const ResultView = ({jobId, jobLists}: Props) => {
  const [response, setReponse] = useState<Response>();
  const [isSummaryPage, setIsSummaryPage] = useState('summary');
  const [valueValidationList, setValueValidationList] = useState([]);
  const [propertyFilter, setPropertyFilter] = useState<{
    selector: string[];
    result: string[];
  }>();
  // useEffect(() => {
  //   const job = jobLists.find(job => job.id === StringsToNum(jobId));
  //   console.log(job);
  //   if (job) {
  //     global.ipcRenderer.send('readJsonFile', job.resultfilePath);
  //   }
  // }, [jobId]);

  useEffect(() => {
    const job = jobLists.find(job => job.id === StringsToNum(jobId));
    console.log(job);
    if (job) {
      global.ipcRenderer.send('readJsonFile', job.resultfilePath);
    }
  }, [jobLists]);

  useEffect(() => {
    global.ipcRenderer.addListener('readJsonFile', (_event, args: any) => {
      if (args === 'running') {
        setReponse(null);
      } else {
        setReponse(args.response);
        const newValueValidationList = setFileLists(args.response.file_list);
        setValueValidationList(newValueValidationList);
        const filters = getFilters(args.response.schema_property);
        setPropertyFilter(filters);
      }
    });
    return () => {
      global.ipcRenderer.removeAllListeners('readJsonFile');
    };
  }, []);

  return (
    <div className="py-4 px-6 space-y-4 h-full overflow-auto">
      <div
        className={
          response
            ? 'bg-white shadow rounded-lg'
            : 'bg-white shadow rounded-lg h-full'
        }
      >
        {response ? (
          <>
            <ResultNavbar
              isSummaryPage={isSummaryPage}
              setIsSummaryPage={setIsSummaryPage}
            />
            {isSummaryPage === 'summary' ? (
              <ResultSummary response={response} jobId={StringsToNum(jobId)} />
            ) : (
              ''
            )}
            {isSummaryPage === 'value' ? (
              <ResultValue
                target_directory={response.target_directory}
                valueValidationList={valueValidationList}
                filters={propertyFilter}
              />
            ) : (
              ''
            )}

            {isSummaryPage === 'schema' ? (
              <ResultSchema
                target_directory={response.target_directory}
                valueValidationList={valueValidationList}
              />
            ) : (
              ''
            )}

            {isSummaryPage === 'chart' ? (
              <ResultChart response={response} />
            ) : (
              ''
            )}
          </>
        ) : jobLists[StringsToNum(jobId)] &&
          jobLists[StringsToNum(jobId)].status === 'failed' ? (
          <ResultFailed job={jobLists[StringsToNum(jobId)]} />
        ) : (
          <ResultLoading />
        )}
      </div>
    </div>
  );
};

export default ResultView;
