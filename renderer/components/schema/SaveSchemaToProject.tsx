import {Dialog, Transition} from '@headlessui/react';
import Link from 'next/link';
import {
  Dispatch,
  SetStateAction,
  useRef,
  Fragment,
  useEffect,
  useState,
} from 'react';
import {useForm} from 'react-hook-form';
import {VailentProject} from '../../pages';

type Props = {
  openEdit: boolean;
  setOpenEdit: Dispatch<SetStateAction<boolean>>;
  schemaData: any;
};

const SaveSchemaToProject = ({openEdit, setOpenEdit, schemaData}: Props) => {
  const cancelButtonRef = useRef(null);
  const [projects, setProjects] = useState<VailentProject[]>([]);
  const [errorAlert, setErrorAlert] = useState(false);
  const {register, handleSubmit} = useForm();

  useEffect(() => {
    console.log('start');
    global.ipcRenderer.send('projectRead');
    global.ipcRenderer.addListener('projectRead', (_event, data) => {
      if (data) {
        const projects = data.datas;
        console.log(data);
        setProjects(projects);
      }
    });
    global.ipcRenderer.addListener('saveSchemaToProject', (_event, data) => {
      if (data) {
        console.log(data);
      }
    });

    return () => {
      global.ipcRenderer.removeAllListeners('projectRead');
      global.ipcRenderer.removeAllListeners('saveSchemaToProject');
    };
  }, []);

  const selectProject = id => {
    console.log(id);
    const filename =
      (document.getElementById('schemaId') as HTMLInputElement).value + '.json';

    global.ipcRenderer.send('saveSchemaToProject', {
      id,
      schema: schemaData,
      filename,
    });
    setOpenEdit(false);
  };

  return (
    <Transition.Root show={openEdit} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setOpenEdit}
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
                    Save Schema to Project
                  </Dialog.Title>
                  <div className="mt-2">
                    <div className="my-4">
                      <form className="flex items-center gap-x-4">
                        <h1 className="w-32">스키마 이름 : </h1>
                        <input
                          type="text"
                          id="schemaId"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <span>.json</span>
                        <div className="flex"></div>
                      </form>
                    </div>

                    <div className="grid gap-y-4 ">
                      {projects
                        ? projects.map(project => (
                            <div
                              className="flex items-center justify-between"
                              key={project.id}
                            >
                              <div className="font-bold">{project.title}</div>
                              <div className="flex flex-row gap-x-4">
                                <div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      selectProject(project.id);
                                    }}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                  >
                                    선택하기
                                  </button>
                                </div>
                                <div>
                                  <Link
                                    href={{
                                      pathname: `/projects/${project.id}`,
                                      query: {title: project.title},
                                    }}
                                  >
                                    <button
                                      type="button"
                                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                                    >
                                      프로젝트 이동
                                    </button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))
                        : null}
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

export default SaveSchemaToProject;
