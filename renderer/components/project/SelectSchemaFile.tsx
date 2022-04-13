import {Dispatch, Fragment, SetStateAction, useEffect, useState} from 'react';
import {Combobox, Dialog, Transition} from '@headlessui/react';
import {SearchIcon} from '@heroicons/react/solid';
import {
  DocumentIcon,
  FolderAddIcon,
  FolderIcon,
} from '@heroicons/react/outline';
import {useRouter} from 'next/router';
import Link from 'next/link';

const quickActions = [
  {name: 'Add new Schema', icon: FolderAddIcon, shortcut: 'F', url: '#'},
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

interface Prop {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function SelectSchemaFile({open, setOpen}: Prop) {
  const [query, setQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [schemas, setSchemas] = useState([]);
  const [recent, setRecent] = useState([]);
  const [projectId, setProjectId] = useState<number>();

  const router = useRouter();
  useEffect(() => {
    const {
      query: {id},
    } = router;
    if (typeof id == 'string') {
      setProjectId(parseInt(id));
    }
    // console.log(id);
    global.ipcRenderer.send('projectSchemaList', id);
    global.ipcRenderer.addListener('projectSchemaList', (_event, data) => {
      if (data) {
        // console.log(data);
        setSchemas(data);
        setRecent(data);
      }
    });

    return () => {
      global.ipcRenderer.removeAllListeners('projectSchemaList');
    };
  }, []);

  const filteredProjects =
    query === ''
      ? []
      : schemas.filter(project => {
          return project.toLowerCase().includes(query.toLowerCase());
        });

  const schemaSelect = fileName => {
    const sendObj = {fileName, id: projectId};
    // console.log(sendObj);
    global.ipcRenderer.send('selectSchemaFile', sendObj);
    setOpen(false);
  };

  return (
    <Transition.Root show={open} as={Fragment} afterLeave={() => setQuery('')}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20"
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Combobox
            as="div"
            className="mx-auto max-w-2xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all"
            // onChange={item => (window.location = item.url)}
            value={selectedProject}
            onChange={setSelectedProject}
          >
            <div className="relative">
              <SearchIcon
                className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <Combobox.Input
                className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-800 placeholder-gray-400 focus:ring-0 sm:text-sm"
                placeholder="Search..."
                onChange={event => setQuery(event.target.value)}
              />
            </div>

            {(query === '' || filteredProjects.length > 0) && (
              <Combobox.Options
                static
                className="max-h-80 scroll-py-2 divide-y divide-gray-100 overflow-y-auto"
              >
                <li className="p-2">
                  {query === '' && (
                    <h2 className="mt-4 mb-2 px-3 text-xs font-semibold text-gray-500">
                      Recent Schema
                    </h2>
                  )}
                  <ul className="text-sm text-gray-700">
                    {(query === '' ? recent : filteredProjects).map(
                      (schemaFileName, key) => (
                        <Combobox.Option
                          key={key}
                          value={schemaFileName}
                          className={({active}) =>
                            classNames(
                              'flex cursor-default select-none items-center rounded-md px-3 py-2',
                              active && 'bg-indigo-600 text-white',
                            )
                          }
                          onClick={() => {
                            schemaSelect(schemaFileName);
                          }}
                        >
                          {({active}) => (
                            <button
                              // onClick={schemaSelect}
                              onClick={() => {
                                schemaSelect(schemaFileName);
                              }}
                              className="flex justify-between items-center w-full"
                            >
                              <div className="flex items-center">
                                <DocumentIcon
                                  className={classNames(
                                    'h-6 w-6 flex-none',
                                    active ? 'text-white' : 'text-gray-400',
                                  )}
                                  aria-hidden="true"
                                />
                                <span className="ml-3 flex-auto truncate">
                                  {schemaFileName}
                                </span>
                              </div>
                              {active && (
                                <span className="ml-3 flex-none text-indigo-100">
                                  선택하기
                                </span>
                              )}
                            </button>
                          )}
                        </Combobox.Option>
                      ),
                    )}
                  </ul>
                </li>
                {query === '' && (
                  <li className="p-2">
                    <h2 className="sr-only">Quick actions</h2>
                    <ul className="text-sm text-gray-700">
                      {quickActions.map(action => (
                        <Combobox.Option
                          key={action.shortcut}
                          value={action}
                          className={({active}) =>
                            classNames(
                              'flex cursor-default select-none items-center rounded-md px-3 py-2',
                              active && 'bg-indigo-600 text-white',
                            )
                          }
                        >
                          {({active}) => (
                            <button>
                              <Link href="/schema">
                                <a className="flex items-center w-full">
                                  <action.icon
                                    className={classNames(
                                      'h-6 w-6 flex-none',
                                      active ? 'text-white' : 'text-gray-400',
                                    )}
                                    aria-hidden="true"
                                  />
                                  <span className="ml-3 flex-auto truncate">
                                    {action.name}
                                  </span>
                                </a>
                              </Link>
                            </button>
                          )}
                        </Combobox.Option>
                      ))}
                    </ul>
                  </li>
                )}
              </Combobox.Options>
            )}

            {query !== '' && filteredProjects.length === 0 && (
              <div className="py-14 px-6 text-center sm:px-14">
                <FolderIcon
                  className="mx-auto h-6 w-6 text-gray-400"
                  aria-hidden="true"
                />
                <p className="mt-4 text-sm text-gray-900">
                  We couldn't find any schemas with that term. Please try again.
                </p>
              </div>
            )}
          </Combobox>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
}
