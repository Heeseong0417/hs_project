import {Dialog, Transition} from '@headlessui/react';
import {
  Dispatch,
  SetStateAction,
  useRef,
  Fragment,
  useEffect,
  useState,
} from 'react';
import toJsonSchema from 'to-json-schema';
import {ErrorAlerts} from '../libs/ErrorAlerts';

type Props = {
  openEdit: boolean;
  setOpenEdit: Dispatch<SetStateAction<boolean>>;
  setSchemaData: Dispatch<SetStateAction<any>>;
};

const JsonToJsonSchema = ({openEdit, setOpenEdit, setSchemaData}: Props) => {
  const cancelButtonRef = useRef(null);
  const [errorAlert, setErrorAlert] = useState(false);

  useEffect(() => {
    global.ipcRenderer.addListener('openJsonFile', (_event, args) => {
      const {datas} = args;
      try {
        JSON.parse(datas);
      } catch (e) {
        setErrorAlert(true);
        setTimeout(() => {
          setErrorAlert(false);
        }, 1000);
        return false;
      }
      (document.getElementById('jsonText') as HTMLInputElement).value = datas;
    });
    return () => {
      global.ipcRenderer.removeAllListeners('openJsonFile');
    };
  }, []);

  const inputJsonSchema = () => {
    const jsontext = (document.getElementById('jsonText') as HTMLInputElement)
      .value;
    const resultSchema = toJsonSchema(JSON.parse(jsontext));
    setSchemaData(resultSchema);
    setOpenEdit(false);
  };
  const clearTextarea = () => {
    (document.getElementById('jsonText') as HTMLInputElement).value = '';
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
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    Convert Json To Json Schema
                  </Dialog.Title>
                  <div className="mt-2">
                    <div className="my-2 flex ">
                      <button
                        type="button"
                        onClick={clearTextarea}
                        className="relative inline-flex items-center px-4 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        새로 만들기
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          global.ipcRenderer.send('openJsonFile');
                        }}
                        className="-ml-px relative inline-flex items-center px-4 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        불러오기
                      </button>
                    </div>
                    {errorAlert ? (
                      <ErrorAlerts errorMessage="Json 형식이 아닙니다. Json 파일을 다시 선택하세요." />
                    ) : null}

                    <div className="grid gap-x-2">
                      <div className="">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 text-left"
                        >
                          Json
                        </label>
                        <div className="mt-2">
                          <textarea
                            id="jsonText"
                            className="h-96 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Json"
                          />
                        </div>
                      </div>
                      {/* <div className="col-span-3">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 text-left"
                        >
                          Json schema
                        </label>
                        <div className="mt-2">
                          <textarea
                            id="jsonSchemaText"
                            className="h-96 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Json"
                          />
                        </div>
                      </div> */}
                    </div>

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0  sm:text-sm"
                        onClick={() => setOpenEdit(false)}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={inputJsonSchema}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                      >
                        Import
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

export default JsonToJsonSchema;
