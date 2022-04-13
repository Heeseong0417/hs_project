import Link from 'next/link';
import React from 'react';

type Props = {
  selectProjectId: string | string[];
};

const ProjectMain = ({selectProjectId}: Props) => {
  return (
    <>
      <div className="min-h-full pt-16 pb-12 flex flex-col bg-white">
        <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16">
            <div className="text-center">
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
                Passbucket Desktop
              </p>
              <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                Welcome
              </h1>
              <p className="mt-2 text-base text-gray-500">
                기존 시험 결과를 조회하거나 신규 시험을 생성할 수 있어요.
              </p>
              <div className="mt-6">
                <Link
                  href={{
                    pathname: `/projects/${selectProjectId}`,
                    query: {
                      jobId: 'new',
                    },
                  }}
                  as={`/projects/${selectProjectId}`}
                >
                  <a className="text-base font-medium text-indigo-600 hover:text-indigo-500">
                    새로운 시험 검증 만들기
                  </a>
                </Link>
              </div>
              <div className="mt-6">
                <Link
                  href={{
                    pathname: `/`,
                  }}
                >
                  <a className="text-base font-medium text-indigo-600 hover:text-indigo-500">
                    프로젝트 선택으로 돌아가기
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProjectMain;
