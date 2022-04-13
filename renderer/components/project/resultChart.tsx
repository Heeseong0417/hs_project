import React, {useEffect, useState} from 'react';
import {Response} from './resultView';
import {BarDatum, ResponsiveBar} from '@nivo/bar';
import BarChart from './chart/BarChart';

type Props = {
  response: Response;
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

const datas = [
  {
    // files: '',
    burger: 48,
    sandwich: 30,
    kebab: 153,
    fries: 32,
    donut: 157,
  },
];

type PropBarChart = {
  key: string[];
  data: BarDatum[];
  title?: string;
};
// valid_schema_count
const ResultChart = ({response}: Props) => {
  const [fileChart, setFileChart] = useState<PropBarChart>();
  const [validSchemaChart, setValidSchemaChart] = useState<PropBarChart>();
  const [valueCountChart, setValueCountChart] = useState<PropBarChart[]>();
  const [validValueCountChart, setValidValueCountChart] =
    useState<PropBarChart[]>();

  useEffect(() => {
    let fileCountKey: string[] = [];
    let fileCount = [];
    Object.entries(response.file_count).map(entrie => {
      fileCountKey.push(entrie[0]);
    });
    const fileCountObj = Object.assign({}, response.file_count);
    fileCountObj['indexName'] = 'file';

    fileCount.push(fileCountObj);
    setFileChart({
      key: fileCountKey,
      data: fileCount,
    });
    let validSchemaCountKey: string[] = [];
    let validSchemaCount = [];
    Object.entries(response.valid_schema_count).map(entrie => {
      validSchemaCountKey.push(entrie[0]);
    });
    const validSchemaObj = Object.assign({}, response.valid_schema_count);
    validSchemaObj['indexName'] = '';
    validSchemaCount.push(validSchemaObj);
    setValidSchemaChart({
      key: validSchemaCountKey,
      data: validSchemaCount,
    });
    let valueCountArray: PropBarChart[] = [];

    Object.entries(response.schema_property).map(([key, value]) => {
      let schemaPropertyObj: PropBarChart = {key: [], data: []};
      Object.entries(value).map(([key, value]) => {
        if (key == 'value_count') {
          const valueCountObj = Object.assign({}, value);
          if (typeof valueCountObj == 'object') {
            Object.entries(valueCountObj).map(([key]) => {
              schemaPropertyObj.key.push(key);
            });
            valueCountObj['indexName'] = 'count';
            schemaPropertyObj.data.push(valueCountObj);
          }
          valueCountArray.push(schemaPropertyObj);
        }
      });
      // console.log(valueCountArray);
    });
    setValueCountChart(valueCountArray);

    let validValueCountArray: PropBarChart[] = [];
    Object.entries(response.schema_property).map(([key, value]) => {
      let schemaPropertyObj: PropBarChart = {key: [], data: []};
      Object.entries(value).map(([key, value]) => {
        if (key == 'valid_value_count') {
          const tmpObj = Object.assign({}, value);
          if (typeof tmpObj == 'object') {
            Object.entries(tmpObj).map(([key]) => {
              schemaPropertyObj.key.push(key);
            });
            tmpObj['indexName'] = 'count';
            schemaPropertyObj.data.push(tmpObj);
          }
          validValueCountArray.push(schemaPropertyObj);
        }
      });
      // console.log(valueCountArray);
    });
    console.log(validValueCountArray);
    setValidValueCountChart(validValueCountArray);

    return () => {};
  }, []);
  return (
    <>
      <div className="px-4 py-5 md:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          결과 시각화
        </h3>
      </div>

      <div className="border-t px-4 py-5 md:px-6">
        <h3 className="text-md leading-4 font-medium text-gray-900">
          1. 파일 통계
        </h3>
      </div>
      <div className=" border-gray-200 px-4 py-0 md:p-0">
        <dl className="md:divide-y md:divide-gray-200">
          <div className="py-1 md:grid md:grid-cols-4 md:gap-1 md:px-6">
            <div className="col-span-4 h-28">
              {fileChart ? <BarChart chartObj={fileChart} /> : null}
            </div>
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
          <h3 className="px-12 pt-2 text-md leading-4 font-medium text-gray-900">
            - 프로퍼티 통계
          </h3>
          <div className="py-1 px-6">
            <div className="h-28">
              {valueCountChart && valueCountChart[idx] ? (
                <BarChart chartObj={valueCountChart[idx]} />
              ) : null}
            </div>
          </div>
          <h3 className="px-12 pt-2 text-md leading-4 font-medium text-gray-900">
            - 프로퍼티 통계 통과
          </h3>
          <div className="py-1 md:grid md:grid-cols-4 md:gap-1 md:px-6">
            <div className="col-span-4 h-28">
              {validValueCountChart && validValueCountChart[idx] ? (
                <BarChart chartObj={validValueCountChart[idx]} />
              ) : null}
            </div>
          </div>
        </div>
      ))}
      <div className="border-y px-4 py-5 md:px-6">
        <h3 className="text-md leading-4 font-medium text-gray-900">
          3. 구문 정확성
        </h3>
      </div>
      <div className=" border-gray-200 px-4 py-5 md:p-0">
        <dl className="md:divide-y md:divide-gray-200">
          <div className="py-1 md:grid md:grid-cols-4 md:gap-1 md:px-6">
            <div className="col-span-4 h-28">
              {validSchemaChart ? (
                <BarChart chartObj={validSchemaChart} />
              ) : null}
            </div>
          </div>
        </dl>
      </div>
    </>
  );
};

export default ResultChart;
