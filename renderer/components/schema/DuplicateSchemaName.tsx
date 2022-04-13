import {XCircleIcon} from '@heroicons/react/outline';
import {CheckCircleIcon} from '@heroicons/react/solid';
import {Dispatch} from 'react';

interface Prop {
  setAlert: Dispatch<React.SetStateAction<boolean>>;
}

export default function DuplicateSchemaName({setAlert}: Prop) {
  return (
    <div className="absolute z-10 bottom-0 left-0 right-0 m-5">
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              이미 동일한 스키마 파일명이 존재합니다.
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <ul role="list" className="list-disc pl-5 space-y-1">
                <li>파일명을 변경하세요.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
