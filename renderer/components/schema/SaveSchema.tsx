import {CheckCircleIcon} from '@heroicons/react/solid';
import {useRouter} from 'next/router';
import {Dispatch} from 'react';

interface Prop {
  setSaveSchema: Dispatch<React.SetStateAction<boolean>>;
  projectId: number;
}

export default function SaveSchema({setSaveSchema, projectId}: Prop) {
  const router = useRouter();

  return (
    <div className="absolute bottom-0 left-0 right-0 m-5 pl-64">
      <div className="rounded-md bg-green-50 p-4">
        <div className="flex w-full">
          <div className="flex-shrink-0">
            <CheckCircleIcon
              className="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3 flex flex-col w-full">
            <h3 className="text-sm font-medium text-green-800">
              Save completed
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>스키마 파일 저장 되었습니다.</p>
            </div>
            <div className="mt-4 pr-4 w-full flex flex-col ">
              <div className="-mx-2 -my-1.5 flex justify-end">
                <button
                  type="button"
                  className="bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                  onClick={() => {
                    router.push(`/projects/${projectId}`);
                  }}
                >
                  시험 하러가기
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSaveSchema(false);
                  }}
                  className="ml-3 bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
