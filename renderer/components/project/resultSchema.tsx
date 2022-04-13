import React, {useEffect, useState} from 'react';
import {Response} from './resultView';

type Props = {
  target_directory: string;
  valueValidationList: any;
  // filters?: {
  //   result: string[];
  // };
};

const ResultSchema = ({target_directory, valueValidationList}: Props) => {
  const [resultValueValidationList, setResultValueValidationList] =
    useState(valueValidationList);
  // const [resultFilter, setResultFilter] = useState('all');
  const invalid_value_lists = ['all', 'pass', 'fail'];
  const openFile = event => {
    // const filePath = target_directory + event.target.innerText;
    const filePath = target_directory + '\\' + event.target.innerText;
    console.log(filePath);
    global.ipcRenderer.send('showFile', filePath);
  };

  const handleSelectResult = e => {
    const seleteValue = e.target.value;
    let tmpValidationList = [];
    if (seleteValue !== 'all') {
      const invalid_value = seleteValue == 'fail' ? false : true;
      tmpValidationList = valueValidationList.filter(
        value => value.invalid_value === invalid_value,
      );
    } else {
      tmpValidationList = valueValidationList;
    }

    setResultValueValidationList(tmpValidationList);
    // setResultFilter(seleteValue);
  };

  return (
    <>
      <div className="px-4 py-5 md:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          구문 검증 리포트
        </h3>
        {/* <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  블라블라라라블라
                </p> */}
      </div>

      {/* <div className="px-4 py-5 md:px-6 grid grid-cols-2 gap-x-6">
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            결과
          </label>
          <select
            onChange={handleSelectResult}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {invalid_value_lists.map((value, key) => (
              <option key={key}>{value}</option>
            ))}
          </select>
        </div>
      </div> */}

      <div className="border-t border-gray-200 px-4 py-5 md:p-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="text-center px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                파일 명
              </th>
              <th
                scope="col"
                className="text-center px-6 py-3 w-20  text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                결과
              </th>

              <th
                scope="col"
                className="text-center px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                구문 오류
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y-2 divide-gray-200  text-xs font-medium gap-y-1">
            {resultValueValidationList.length !== 0
              ? resultValueValidationList.map((list, key) => (
                  <tr key={key} className=" break-all">
                    <td
                      onClick={openFile}
                      className="px-2 py-2 cursor-pointer order-1"
                      key={0}
                    >
                      {list.fileName}
                    </td>
                    <td className="text-center px-2 py-2" key={3}>
                      {list.valid_schema ? (
                        <span className="border-2 rounded-2xl px-1.5 py-0.5 border-green-500 bg-green-400 text-white text-[10px]">
                          {/* <span className="border rounded-xl px-1.5 py-0.5 border-red-500 bg-red-400 text-white text-xs"> */}
                          Pass
                        </span>
                      ) : (
                        <span className="border-2 rounded-xl px-1.5 py-0.5 border-red-500 bg-red-400 text-white text-[10px]">
                          Fail
                        </span>
                      )}
                    </td>
                    <td className=" px-2 py-2" key={4}>
                      {list.schema_validation_msg}
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ResultSchema;
