import {Dialog, Transition} from '@headlessui/react';
import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import {useForm} from 'react-hook-form';
import {VailentProject} from '../../pages';

type Props = {
  isEditProject: boolean;
  setIsEditProject: Dispatch<SetStateAction<boolean>>;
  setProjects: Dispatch<SetStateAction<VailentProject[]>>;
  projects: VailentProject[];
  selectProject: VailentProject;
  setPinnedProjects: Dispatch<SetStateAction<VailentProject[]>>;
};
type SubmitPrjData = {
  title: string;
  pinned: number;
  type: string;
};

const EditProject = ({
  isEditProject,
  setIsEditProject,
  setProjects,
  projects,
  selectProject,
  setPinnedProjects,
}: Props) => {
  const {register, setValue, handleSubmit} = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    // defaultValues: {
    //   title: selectProject.title,
    //   pinned: selectProject.pinned ? 1 : 0,
    // },
  });

  useEffect(() => {
    console.log('edit page');
    console.log(selectProject.pinned, selectProject.pinned ? 1 : 0);
    setValue('pinned', selectProject.pinned ? 1 : 0);
    setValue('title', selectProject.title);
    setValue('type', selectProject.type);

    return () => {};
  }, [selectProject]);

  const cancelButtonRef = useRef(null);

  const onSubmit = ({title, pinned, type}: SubmitPrjData) => {
    const newProjects = projects;
    const foundIndex = newProjects.findIndex(
      project => project.id === selectProject.id,
    );
    newProjects[foundIndex].pinned = pinned == 1 ? true : false;
    newProjects[foundIndex].title = title;
    newProjects[foundIndex].type = type;
    // console.log(pinned);
    // console.log(newProjects[foundIndex].pinned);
    // console.log(newProjects);

    setProjects(newProjects);
    setPinnedProjects(newProjects.filter(project => project.pinned));

    global.ipcRenderer.send('projectWrite', {datas: newProjects});
    setIsEditProject(false);
  };

  return (
    <Transition.Root show={isEditProject} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setIsEditProject}
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
                    Edit Project
                  </Dialog.Title>
                  <div className="mt-2">
                    <form
                      className="flex flex-col gap-y-3"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <div>
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-gray-700 text-left"
                        >
                          Project Title
                        </label>
                        <div className="mt-2">
                          <input
                            {...register('title', {required: true})}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Project Title"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4">
                        <div className="grid grid-cols-2 items-center justify-between gap-x-4">
                          <label
                            htmlFor="pinned"
                            className="block text-sm font-medium text-gray-700 text-left"
                          >
                            is Pinned Project?
                          </label>
                          <select
                            className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                            {...register('pinned')}
                          >
                            <option value={1}>True</option>
                            <option value={0}>False</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 items-center justify-between  gap-x-4">
                          <label
                            htmlFor="type"
                            className="block text-sm font-medium text-gray-700 text-left"
                          >
                            Schema file format
                          </label>
                          <select
                            className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                            {...register('type')}
                          >
                            <option>json</option>
                            <option>xml</option>
                          </select>
                          {/* <input
                          type="checkbox"
                          placeholder="pinned"
                          {...register('pinned', {required: true})}
                        /> */}
                        </div>
                      </div>

                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <div>
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                            // onClick={() => setIsEditProject(false)}
                          >
                            Edit
                          </button>
                        </div>
                        <div>
                          <button
                            type="submit"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                            onClick={() => setIsEditProject(false)}
                            ref={cancelButtonRef}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
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

export default EditProject;
