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
  isNewSchema: boolean;
  setIsNewSchema: Dispatch<SetStateAction<boolean>>;
  project: VailentProject;
  setSchemaDesignerState: Dispatch<SetStateAction<PropSchemaDesignerState>>;
};
type SubmitNewSchemaData = {
  name: string;
};

export default function NewSchema({
  isNewSchema,
  setIsNewSchema,
  project,
  setSchemaDesignerState,
}: Props) {
  const {register, handleSubmit, getValues, formState} =
    useForm<SubmitNewSchemaData>({
      mode: 'onChange',
    });
  const cancelButtonRef = useRef(null);

  const [dupliateAlert, setDuplicateAlert] = useState(false);

  console.log(project);

  const initSchema = {
    type: 'object',
    properties: {},
    required: [],
  };
  useEffect(() => {
    global.ipcRenderer.addListener('projectSchemaFileCheck', (_event, args) => {
      console.log(args);
      if (args) {
        console.log('success');

        setIsNewSchema(false);

        setSchemaDesignerState({
          projectId: project.id,
          schemaFileName: `${getValues('name')}.json`,
          schemaFilePath: null,
          state: 'new',
          jsonSchema: initSchema,
        });
      } else {
        setDuplicateAlert(true);
        setTimeout(() => {
          setDuplicateAlert(false);
        }, 1000);
      }
    });

    return () => {
      global.ipcRenderer.removeAllListeners('projectSchemaFileCheck');
    };
  }, []);

  const onSubmit = ({name}: SubmitNewSchemaData) => {
    // console.log(project.id, name);
    global.ipcRenderer.send('projectSchemaFileCheck', {
      projectId: project.id,
      schemaName: name,
    });
  };

  return (
    <Transition.Root show={isNewSchema} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setIsNewSchema}
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
                    Creat New Schema - {project ? project.title : null}
                  </Dialog.Title>
                  <div className="mt-2">
                    <form
                      className="flex flex-col gap-y-3"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <div>
                        <div className="mt-2 flex items-center gap-x-2">
                          <label
                            htmlFor="title"
                            className="w-52 text-gray-700 text-left  font-xl font-bold"
                          >
                            Schema file Name
                          </label>
                          <input
                            {...register('name', {required: true})}
                            className="flex-auto appearance-none text-right block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Schema file Name"
                          />
                          <p className="flex-auto font-xl font-bold">.json</p>
                        </div>
                      </div>

                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <div>
                          <button
                            type="submit"
                            className={`order-2 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2  text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm ${
                              !formState.isValid
                                ? 'cursor-not-allowed bg-purple-200'
                                : 'bg-indigo-600'
                            }`}
                          >
                            Create
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            className="order-1 mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                            onClick={() => setIsNewSchema(false)}
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
}
