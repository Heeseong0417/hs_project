import Link from 'next/link';
import React from 'react';
import {JobListProp} from '../../pages/projects/[id]';
import {stringDate} from '../libs/stringDate';

type Props = {
  jobs: JobListProp[];
  selectProjectId: string | string[];
};

const TestNavList = ({jobs, selectProjectId}: Props) => {
  return (
    <nav className="min-h-0 flex-1 overflow-y-auto">
      <ul
        role="list"
        className="border-b border-gray-200 divide-y divide-gray-200"
      >
        {jobs.map(job => (
          <li
            key={job.id}
            className="relative bg-white py-2 px-6 hover:bg-gray-50 
            focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600"
          >
            <div className="flex justify-between space-x-3">
              <div className="min-w-0 flex-1">
                <Link
                  href={{
                    pathname: `/projects/${selectProjectId}`,
                    query: {
                      jobId: job.id,
                    },
                  }}
                  as={`/projects/${selectProjectId}`}
                >
                  <a className="flex justify-between focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-lg font-medium text-gray-900 truncate">
                      # {job.id}
                    </p>
                    <p className=" text-gray-500 truncate">{job.status}</p>
                  </a>
                </Link>
              </div>
            </div>
            <div className="mt-1">
              <p className="line-clamp-2 text-sm text-right text-gray-600">
                {stringDate({dates: job.date})}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TestNavList;
