import {useRouter} from 'next/router';
import React from 'react';
import {Response} from './resultView';

type Props = {
  response: Response;
  jobId: number;
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

const ResultSummary = ({response, jobId}: Props) => {
  const {
    query: {id: projectId},
  } = useRouter();

  return (
    <>
      <div className="px-4 py-5 md:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          시험 검증 리포트
        </h3>
        <button
          onClick={() => {
            global.ipcRenderer.send('exportXlsxFile', {
              projectId: StringsToNum(projectId),
              jobId,
            });
          }}
          className="inline-flex items-center px-1.5 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
        >
          엑셀 파일로 다운 받기
        </button>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 md:p-0">
        <dl className="md:divide-y md:divide-gray-200">
          <div className="py-4 md:py-5 grid grid-cols-4 gap-4 px-6 items-center">
            <dt className="text-sm font-medium text-gray-500 col-span-1">
              데이터 셋 경로
            </dt>
            <dd className="mt-1 text-sm text-gray-900 md:mt-0 md:col-span-1 cursor-pointer col-span-1">
              <button
                onClick={() => {
                  global.ipcRenderer.send(
                    'showFile',
                    response.target_directory,
                  );
                }}
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                경로 열기
              </button>
            </dd>
            <dt className="text-sm font-medium text-gray-500 col-span-1">
              스키마 파일
            </dt>
            <dd className="mt-1 text-sm text-gray-900 md:mt-0 md:col-span-1 cursor-pointer col-span-1">
              <button
                onClick={() => {
                  global.ipcRenderer.send('showFile', response.schema_path);
                }}
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                파일 열기
              </button>
            </dd>
          </div>

          <div className="py-4 grid grid-cols-4 gap-4 px-6">
            <dt className="text-sm font-medium text-gray-500">데이터 타입</dt>
            <dd className="mt-1 text-sm text-gray-900 md:mt-0 md:col-span-1">
              {response.data_type}
            </dd>
            <dt className="text-sm font-medium text-gray-500">실행 시간</dt>
            <dd className="mt-1 text-sm text-gray-900 md:mt-0 md:col-span-1">
              {response.elapsed_time.toFixed(3)} 초
            </dd>
          </div>
        </dl>
      </div>
      <div className="border-t px-4 py-5 md:px-6">
        <h3 className="text-md leading-4 font-medium text-gray-900">
          1. 파일 통계
        </h3>
      </div>
      <div className=" border-gray-200 px-4 py-5 md:p-0">
        <dl className="md:divide-y md:divide-gray-200">
          <div className="py-4 md:py-5 md:grid md:grid-cols-4 md:gap-4 md:px-6">
            <dt className="pl-4 text-sm font-medium text-gray-500">결과</dt>
            <dd className="mt-1 text-sm text-gray-900 md:mt-0 md:col-span-3 grid grid-cols-2 gap-y-4">
              {Object.entries(response.file_count).map((entrie, idx) => (
                <div key={idx} className="flex justify-start gap-x-4">
                  <h1>{`${entrie[0]} : ${entrie[1]}`}</h1>
                </div>
              ))}
            </dd>
          </div>
        </dl>
      </div>
      <div className="border-y px-4 py-5 md:px-6">
        <h3 className="text-md leading-4 font-medium text-gray-900">
          2. 프로퍼티 통계
        </h3>
      </div>
      {Object.entries(response.schema_property).map(([key, value], idx) => (
        <div className="border-b border-gray-200 px-4 py-5 md:p-0" key={idx}>
          <h3 className="px-8 py-4 text-md leading-4 font-medium text-gray-900">
            2.{idx + 1}. {key}
          </h3>
          {Object.entries(value).map(([key, value], idx) => (
            <dl className="md:divide-y md:divide-gray-200 mx-4" key={idx}>
              {key === 'value_list' ? (
                <div className="py-4 md:grid md:grid-cols-4 md:gap-4 md:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    입력 프로퍼티
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 md:mt-0 md:col-span-3">
                    {value}
                  </dd>
                </div>
              ) : null}
              {key === 'type' ? (
                <div className="py-4 md:grid md:grid-cols-4 md:gap-4 md:px-6">
                  <dt className="text-sm font-medium text-gray-500">타입</dt>
                  <dd className="mt-1 text-sm text-gray-900 md:mt-0 md:col-span-3">
                    {value}
                  </dd>
                </div>
              ) : null}
              {key === 'value_count' ? (
                <div className="py-4 md:grid md:grid-cols-4 md:gap-4 md:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    프로퍼티 통계
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 md:mt-0 md:col-span-3 grid grid-cols-2">
                    {Object.entries(value).map(([key, value], idx) => (
                      <div
                        key={idx}
                        className="flex justify-start gap-x-4 col-span-1"
                      >
                        <h1>{`${key} : ${value}`}</h1>
                      </div>
                    ))}
                  </dd>
                </div>
              ) : null}
              {key === 'valid_value_count' ? (
                <div className="py-4 md:grid md:grid-cols-4 md:gap-4 md:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    프로퍼티 통계 통과
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 md:mt-0 md:col-span-3 grid grid-cols-2">
                    {Object.entries(value).map(([key, value], idx) => (
                      <div
                        key={idx}
                        className="flex justify-start gap-x-4 col-span-1 items-center"
                      >
                        {key === 'valid' ? (
                          <>
                            <span className="border-2 rounded-2xl px-1.5 border-green-500 bg-green-400 text-white text-[10px]">
                              Pass
                            </span>{' '}
                            <span className="font-bold">{value}</span>
                          </>
                        ) : null}

                        {key === 'invalid' ? (
                          <>
                            <span className="border-2 rounded-xl px-1.5 border-red-500 bg-red-400 text-white text-[10px]">
                              Fail
                            </span>
                            <span className="font-bold">{value}</span>
                          </>
                        ) : null}
                      </div>
                    ))}
                  </dd>
                </div>
              ) : null}
            </dl>
          ))}
        </div>
      ))}

      <div className="border-y px-4 py-5 md:px-6">
        <h3 className="text-md leading-4 font-medium text-gray-900">
          3. 구문 정확성
        </h3>
      </div>
      <div className=" border-gray-200 px-4 py-5 md:p-0">
        <dl className="md:divide-y md:divide-gray-200">
          <div className="py-4 md:py-5 md:grid md:grid-cols-4 md:gap-4 md:px-6">
            <dt className="pl-4 text-sm font-medium text-gray-500">결과</dt>
            <dd className="mt-1 text-sm text-gray-900 md:mt-0 md:col-span-3 grid grid-cols-2">
              {Object.entries(response.valid_schema_count).map(
                (entrie, idx) => (
                  <div
                    key={idx}
                    className="flex justify-start gap-x-4 items-center"
                  >
                    {entrie[0] === 'valid' ? (
                      <>
                        <span className="border-2 rounded-2xl px-1.5 border-green-500 bg-green-400 text-white text-[10px]">
                          Pass
                        </span>{' '}
                        <span className="font-bold">{entrie[1]}</span>
                      </>
                    ) : null}

                    {entrie[0] === 'invalid' ? (
                      <>
                        <span className="border-2 rounded-xl px-1.5 border-red-500 bg-red-400 text-white text-[10px]">
                          Fail
                        </span>
                        <span className="font-bold">{entrie[1]}</span>
                      </>
                    ) : null}
                  </div>
                ),
              )}
            </dd>
          </div>
        </dl>
      </div>
    </>
  );
};

export default ResultSummary;
