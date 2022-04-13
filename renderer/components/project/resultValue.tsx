import {useEffect, useState} from 'react';

type Props = {
  target_directory: string;
  valueValidationList: any;
  filters?: {
    selector: string[];
    result: string[];
  };
};

const ResultValue = ({
  target_directory,
  valueValidationList,
  filters,
}: Props) => {
  const [resultValueValidationList, setResultValueValidationList] =
    useState(valueValidationList);
  const [selecterFilter, setSelecterFilter] = useState('all');
  const [resultFilter, setResultFilter] = useState('all');

  useEffect(() => {
    setResultValueValidationList(valueValidationList);
  }, [valueValidationList]);

  const openFile = event => {
    // const filePath = target_directory + event.target.innerText;
    let filePath = target_directory + '\\' + event.target.innerText;
    console.log(target_directory);
    console.log(filePath);
    global.ipcRenderer.send('showFile', filePath);
  };

  const handleSelectSelector = e => {
    const seleteValue = e.target.value;
    let tmpValidationList = [];
    if (seleteValue !== 'all') {
      tmpValidationList = valueValidationList.filter(
        value => value.selector === seleteValue,
      );
    } else {
      tmpValidationList = valueValidationList;
    }
    if (tmpValidationList.length !== 0) {
      if (resultFilter !== 'all') {
        const result = resultFilter == 'pass' ? true : false;
        tmpValidationList = tmpValidationList.filter(
          value => value.result === result,
        );
      }
    }
    setResultValueValidationList(tmpValidationList);
    setSelecterFilter(seleteValue);
  };

  const handleSelectResult = e => {
    const seleteValue = e.target.value;
    let tmpValidationList = [];
    if (seleteValue !== 'all') {
      const result = seleteValue == 'pass' ? true : false;
      tmpValidationList = valueValidationList.filter(
        value => value.result === result,
      );
    } else {
      tmpValidationList = valueValidationList;
    }

    if (tmpValidationList.length !== 0) {
      if (selecterFilter !== 'all') {
        tmpValidationList = tmpValidationList.filter(
          value => value.selector === selecterFilter,
        );
      }
    }
    setResultValueValidationList(tmpValidationList);
    setResultFilter(seleteValue);
  };

  return (
    <>
      <div className="px-4 py-5 md:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          통계적 다양성 - 대상 파일
        </h3>
      </div>

      <div className="px-4 py-5 md:px-6 grid grid-cols-2 gap-x-6">
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            샐랙터
          </label>
          <select
            onChange={handleSelectSelector}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {filters.selector.map((value, key) => (
              <option key={key}>{value}</option>
            ))}
          </select>
        </div>
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
            {filters.result.map((value, key) => (
              <option key={key}>{value}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="border-t border-gray-200 px-4 py-5 md:p-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="">
              <th
                scope="col"
                className="text-center w-20 md:w-40 lg:w-60 px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                파일 명
              </th>
              <th
                scope="col"
                className="text-center px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                샐랙터
              </th>
              <th
                scope="col"
                className="text-center px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                결과
              </th>
              <th
                scope="col"
                className="text-center px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                값
              </th>

              <th
                scope="col"
                className="text-center  w-20 md:w-40 lg:w-60 xl:w-96 px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                프로퍼티 통계 오류
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
                    <td className=" px-2 py-2" key={1}>
                      {list.selector}
                    </td>
                    <td className="text-center px-2 py-2" key={3}>
                      {list.result ? (
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
                    <td className=" px-2 py-2" key={2}>
                      {list.value}
                    </td>
                    <td className=" px-2 py-2" key={4}>
                      {list.msg}
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

export default ResultValue;
