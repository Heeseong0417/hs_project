import {ReplyIcon} from '@heroicons/react/outline';
import Link from 'next/link';
import React from 'react';
import {JobListProp} from '../../pages/projects/[id]';
import TestNavList from './TestNavList';

type Props = {
  jobs: JobListProp[];
  projectTitle: string | string[];
  selectProjectId: string | string[];
};

const TestAside = ({jobs, projectTitle, selectProjectId}: Props) => (
  <aside className="h-full fixed flex-shrink-0 order-first overflow-y-hidden">
    <div className="h-full relative flex flex-col w-64 border-r border-gray-200 bg-gray-100">
      <div className="flex-shrink-0">
        <div className=" h-16 bg-white px-6 flex flex-col justify-center">
          <div className="flex items-baseline space-x-3 justify-between">
            <Link href="/">
              <a>
                <ReplyIcon className="h-4 w-4" />
              </a>
            </Link>
            <h2 className="text-lg font-medium text-gray-900">
              {projectTitle}
            </h2>
            <p className="text-sm font-medium text-gray-500">
              {jobs.length} lists
            </p>
          </div>
        </div>
        <div className="border-t border-b border-gray-200 bg-gray-50 px-6 py-2 text-sm font-medium text-gray-500">
          <div className="grid">
            <Link
              href={{
                pathname: `/projects/${selectProjectId}`,
                query: {
                  jobId: 'new',
                },
              }}
              as={`/projects/${selectProjectId}`}
            >
              <button
                type="button"
                className="inline-flex items-center justify-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 xl:w-full"
              >
                신규 시험 생성
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="overflow-y-auto">
        {jobs.length !== 0 ? (
          <TestNavList jobs={jobs} selectProjectId={selectProjectId} />
        ) : (
          <div className="flex justify-center items-center bg-white h-48">
            <h3>아직 작업이 없어요.</h3>
          </div>
        )}
      </div>
    </div>
  </aside>
);

export default TestAside;
