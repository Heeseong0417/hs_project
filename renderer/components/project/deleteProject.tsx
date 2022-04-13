import {Dialog, Transition} from '@headlessui/react';
import React, {Dispatch, Fragment, SetStateAction, useRef} from 'react';
import {VailentProject} from '../../pages';

type Props = {
  isDeleteProject: boolean;
  setIsDeleteProject: Dispatch<SetStateAction<boolean>>;
  setProjects: Dispatch<SetStateAction<VailentProject[]>>;
  projects: VailentProject[];
  selectProject: VailentProject;
  setPinnedProjects: Dispatch<SetStateAction<VailentProject[]>>;
};
type SubmitPrjData = {
  title: string;
  pinned: number;
};

const DeleteProject = ({
  isDeleteProject,
  setIsDeleteProject,
  setProjects,
  projects,
  selectProject,
  setPinnedProjects,
}: Props) => {
  const cancelButtonRef = useRef(null);

  const clickDeleteProject = event => {
    const filteredProject = projects.filter(function (project) {
      return project.id != selectProject.id;
    });

    setProjects(filteredProject);
    setPinnedProjects(filteredProject.filter(project => project.pinned));
    // global.ipcRenderer.send('projectWrite', {datas: filteredProject});
    setIsDeleteProject(false);
    global.ipcRenderer.send('projectDelete', selectProject.id);
  };

  return (
    <Transition.Root show={isDeleteProject} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setIsDeleteProject}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    Delete Project
                  </Dialog.Title>
                  <div className="mt-2">
                    <div className="flex flex-col px-6 items-start">
                      <p>Are you absolutely sure?</p>
                      <p>
                        Unexpected bad things will happen if you don’t read
                        this!
                      </p>
                      <p className="text-left">
                        This action cannot be undone. This will permanently
                        delete the{' '}
                        <span className="font-bold">{selectProject.title}</span>{' '}
                        project.
                      </p>
                    </div>
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                        onClick={clickDeleteProject}
                      >
                        Delete
                      </button>
                      <button
                        type="submit"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                        onClick={() => setIsDeleteProject(false)}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default DeleteProject;
