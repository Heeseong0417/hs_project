import React, {useEffect, useState} from 'react';
import {JobListProp} from '../../pages/projects/[id]';

type Props = {
  job: JobListProp;
};
const ResultFailed = ({job}: Props) => {
  return (
    <>
      <div className="px-4 py-5 md:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          작업 실패 - 에러 메시지
        </h3>
      </div>

      <div className="border-t px-4 py-5 md:px-6">
        <p className="text-sm text-gray-600 break-all whitespace-pre-wrap leading-loose">
          {job.errMsg}
        </p>
      </div>
    </>
  );
};

export default ResultFailed;
