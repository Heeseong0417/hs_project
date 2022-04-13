/* This example requires Tailwind CSS v2.0+ */
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import {useForm} from 'react-hook-form';
import {VailentProject} from '../../pages';
import {PropSchemaDesignerState} from '../../pages/schema';
import DuplicateSchemaName from './DuplicateSchemaName';

type Props = {
  isLoadSchema: boolean;
  setIsLoadSchema: Dispatch<SetStateAction<boolean>>;
  project: VailentProject;
  setSchemaDesignerState: Dispatch<SetStateAction<PropSchemaDesignerState>>;
};

export default function LoadSchema({
  isLoadSchema,
  setIsLoadSchema,
  project,
  setSchemaDesignerState,
}: Props) {
  const cancelButtonRef = useRef(null);
  const [dupliateAlert, setDuplicateAlert] = useState(false);
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    global.ipcRenderer.addListener('projectSchemaLists', (_, files) => {
      console.log(files);
      setFiles(files);
    });
    global.ipcRenderer.addListener(
      'loadSchemaToProject',
      (_, jsonSchema, filename) => {
        setSchemaDesignerState({
          projectId: project.id,
          schemaFileName: filename,
          schemaFilePath: null,
          state: 'load',
          jsonSchema,
        });
      },
    );
    global.ipcRenderer.send('projectSchemaLists', project.id);

    return () => {
      global.ipcRenderer.removeAllListeners('projectSchemaLists');
      global.ipcRenderer.removeAllListeners('loadSchemaToProject');
    };
  }, []);

  const selectSchemaFile = file => {
    global.ipcRenderer.send('loadSchemaToProject', project.id, file);
  };

  return (
    <Transition.Root show={isLoadSchema} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setIsLoadSchema}
      >
        {dupliateAlert ? (
          <DuplicateSchemaName setAlert={setDuplicateAlert} />
        ) : null}

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
                    Load Schema in {project.title}
                  </Dialog.Title>
                  <div className="mt-4 gap-y-1 flex flex-col mx-2 border px-4 py-2 rounded-xl divide-y-2">
                    {files.length !== 0 ? (
                      files.map((file, key) => (
                        <div
                          key={key}
                          className="w-full flex justify-between  pt-2"
                        >
                          <h2>{file}</h2>

                          <button
                            className="border border-gray-400 inline-flex items-center text-sm shadow-sm font-medium rounded-md  py-1 px-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-orange-500 "
                            onClick={() => selectSchemaFile(file)}
                          >
                            Select
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="my-20 flex flex-col">
                        <h2>생성된 스키마가 없습니다.</h2>

                        <div className="w-full mt-10">
                          <button
                            className=" border border-gray-400 inline-flex justify-center items-center text-sm shadow-sm font-medium rounded-md  py-1 px-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-orange-500 "
                            onClick={() => setIsLoadSchema(false)}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
