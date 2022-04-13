import {
  ChevronRightIcon,
  DocumentIcon,
  PlusCircleIcon,
} from '@heroicons/react/outline';
import Link from 'next/link';
import {Dispatch, SetStateAction, useState} from 'react';
import {VailentProject} from '../../pages';
import {PropSchemaDesignerState} from '../../pages/schema';
import LoadSchema from './LoadSchema';
import NewSchema from './NewSchema';

type Props = {
  projects: VailentProject[];
  setSchemaDesignerState: Dispatch<SetStateAction<PropSchemaDesignerState>>;
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const SchemaProjectLists = ({projects, setSchemaDesignerState}: Props) => {
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenLoad, setIsOpenLoad] = useState(false);
  const [selectProject, setSelectProject] = useState<VailentProject>();

  const [selectProjectId, setSelectProjectId] = useState(null);

  const addSchema = (id: number) => {
    setSelectProjectId(id);
    const selectProject = projects.find(project => project.id === id);
    setSelectProject(selectProject);
    setIsOpenAdd(true);
  };

  const loadSchema = (id: number) => {
    setSelectProjectId(id);
    const selectProject = projects.find(project => project.id === id);
    setSelectProject(selectProject);
    setIsOpenLoad(true);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center h-full">
      <div className="text-center mb-10">
        <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
          Passbucket Desktop
        </p>
        <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          Schema Designer
        </h1>
        <p className="mt-4 text-base text-gray-500">
          프로젝트에 새로운 스키마를 생성하거나, 기존 스키마를 불러올 수 있어요
          :)
        </p>
      </div>
      <div className="mt-2 w-10/12">
        <h2 className="font-bold mb-4 border-b-2 pb-2">Project Lists</h2>
        <div className="w-full grid gap-y-2">
          {projects && projects.length !== 0 ? (
            projects.map((project, key) => (
              <div
                key={key}
                className="flex w-full justify-between border p-2 rounded-lg items-center"
              >
                <h2 className="ml-2 font-bold text-gray-700">
                  {project.title}
                </h2>
                <div className="flex gap-x-2">
                  <button
                    className="border border-gray-400 inline-flex items-center text-sm shadow-sm font-medium rounded-md py-1  px-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-orange-500 "
                    onClick={() => addSchema(project.id)}
                    // id={project.id}
                  >
                    <PlusCircleIcon className="h-4 w-4 mr-1" />
                    New
                  </button>
                  <button
                    className="border border-gray-400 inline-flex items-center text-sm shadow-sm font-medium rounded-md  py-1 px-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-orange-500 "
                    onClick={() => loadSchema(project.id)}
                  >
                    <DocumentIcon className="h-4 w-4 mr-1" />
                    Load
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col py-10 w-full justify-between border p-2 rounded-lg items-center">
              <p className="mt-2 text-base text-gray-500">
                프로젝트를 생성해야 스키마를 정의할 수 있어요
              </p>
              <div className="mt-6">
                <Link
                  href={{
                    pathname: `/`,
                  }}
                >
                  <a className="text-base font-medium text-indigo-600 hover:text-indigo-500">
                    프로젝트 생성 화면으로 이동하기
                  </a>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      {isOpenAdd && selectProject ? (
        <NewSchema
          isNewSchema={isOpenAdd}
          setIsNewSchema={setIsOpenAdd}
          project={selectProject}
          setSchemaDesignerState={setSchemaDesignerState}
        />
      ) : null}
      {isOpenLoad ? (
        <LoadSchema
          isLoadSchema={isOpenLoad}
          setIsLoadSchema={setIsOpenLoad}
          project={selectProject}
          setSchemaDesignerState={setSchemaDesignerState}
        />
      ) : null}
    </div>
  );
};

export default SchemaProjectLists;
