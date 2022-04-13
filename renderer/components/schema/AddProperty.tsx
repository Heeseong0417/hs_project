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
import {currentSchemaPos} from '../libs/schema';
import ArrayInputForm from './form/ArrayInputForm';
import NumberInputForm from './form/NumberInputForm';
import ObjectInputForm from './form/ObjectInputForm';
import StringInputForm from './form/StringInputForm';
import {ParentType} from './SchemaPropertyItem';

type Props = {
  openAdd: boolean;
  setOpenAdd: Dispatch<SetStateAction<boolean>>;
  parent: ParentType[];
  setSchemaData: Dispatch<any>;
  schemaData: any;
};

const updateSchema = (
  schemaData,
  editDatas,
  parent,
  requiredCheckbox,
  nullableCheckbox,
) => {
  const editProperty = Object.entries(editDatas).map(entrie => {
    if (entrie[0] == 'name') {
      return;
    }
    if (entrie[1] !== '') {
      if (entrie[0] == 'enum') {
        if (typeof entrie[1] === 'string') {
          return {
            [entrie[0]]: entrie[1].split(','),
          };
        }
      } else {
        return {
          [entrie[0]]: entrie[1],
        };
      }
    }
  });
  const newObj = Object.assign({}, ...editProperty);
  const tmpSchemaData = Object.assign({}, schemaData);

  if (nullableCheckbox) {
    newObj.nullable = true;
  }

  if (editDatas.type === 'object') {
    newObj.properties = {};
    newObj.required = [];
  }

  let tmpObj;

  if (parent.length == 0) {
    tmpObj = tmpSchemaData;
  } else {
    tmpObj = currentSchemaPos(parent, tmpSchemaData);
  }

  if (tmpObj.type === 'object') {
    tmpObj.properties[editDatas.name] = newObj;
    if (!tmpObj.required) {
      tmpObj.required = [];
    }

    if (requiredCheckbox) {
      tmpObj.required.push(editDatas.name);
    }
  } else if (tmpObj.type === 'array') {
    if (Array.isArray(tmpObj.items)) {
      tmpObj.items.push(newObj);
    } else {
      if (tmpObj.items.type) {
        tmpObj.items = [tmpObj.items, newObj];
      } else {
        tmpObj.items = newObj;
      }
    }
  }
  return tmpSchemaData;
};

const AddProperty = ({
  openAdd,
  setOpenAdd,
  parent,
  setSchemaData,
  schemaData,
}: Props) => {
  const {register, setValue, watch, handleSubmit} = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const [requiredCheckbox, setRequiredCheckbox] = useState(true);
  const [nullableCheckbox, setNullableCheckbox] = useState(false);
  const watchtype = watch('type', false);

  useEffect(() => {
    setValue('type', 'string');
    if (parent.length > 0 && parent[parent.length - 1].type == 'array') {
      setValue('name', 'new item');
    }
    return () => {};
  }, []);

  const cancelButtonRef = useRef(null);

  const onSubmit = datas => {
    const updateSchemaData = updateSchema(
      schemaData,
      datas,
      parent,
      requiredCheckbox,
      nullableCheckbox,
    );
    if (updateSchemaData !== undefined) {
      setSchemaData(updateSchemaData);
    }
    console.log(updateSchemaData);
    setOpenAdd(false);
  };

  return (
    <Transition.Root show={openAdd} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setOpenAdd}
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
                    {parent.length === 0
                      ? `/ Add Property`
                      : `/${parent.map(p => p.name).join('/')}/ Add Property`}
                  </Dialog.Title>
                  <div className="mt-2">
                    <form
                      className="flex flex-col gap-y-3"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <div className="grid grid-cols-6 gap-x-2">
                        <div className="col-span-3">
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 text-left"
                          >
                            Name
                          </label>
                          <div className="mt-2">
                            <input
                              {...register('name', {required: true})}
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="Property Name"
                              disabled={
                                parent.length > 0 &&
                                parent[parent.length - 1].type == 'array'
                                  ? true
                                  : false
                              }
                            />
                          </div>
                        </div>

                        <div className="col-span-2">
                          <label
                            htmlFor="type"
                            className="block text-sm font-medium text-gray-700 text-left"
                          >
                            Type
                          </label>
                          <div className="mt-2">
                            <select
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              {...register('type')}
                            >
                              <option>object</option>
                              <option>string</option>
                              <option>number</option>
                              <option>array</option>
                              <option>integer</option>
                              <option>boolean</option>
                              <option>null</option>
                            </select>
                          </div>
                        </div>

                        <div className="col-span-1">
                          <label
                            htmlFor="required"
                            className="block text-sm font-medium text-gray-700 text-left"
                          >
                            Required?
                          </label>
                          <div className="mt-2 pt-3 flex justify-center items-center">
                            <input
                              type="checkbox"
                              checked={requiredCheckbox}
                              onChange={() => {
                                setRequiredCheckbox(prev => !prev);
                              }}
                              className="appearance-none block px-2 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                      {watchtype === 'string' ? (
                        <StringInputForm
                          register={register}
                          setValue={setValue}
                          property={{}}
                        />
                      ) : null}

                      {watchtype === 'array' ? (
                        <ArrayInputForm
                          register={register}
                          setValue={setValue}
                          property={{}}
                        />
                      ) : null}
                      {watchtype === 'object' ? (
                        <ObjectInputForm
                          register={register}
                          setValue={setValue}
                          property={{}}
                        />
                      ) : null}

                      {watchtype === 'number' || watchtype === 'integer' ? (
                        <NumberInputForm
                          register={register}
                          setValue={setValue}
                          property={{}}
                        />
                      ) : null}

                      <div>
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-gray-700 text-left"
                        >
                          nullable?
                        </label>
                        <div className="mt-2">
                          <input
                            type="checkbox"
                            checked={nullableCheckbox}
                            onChange={() => {
                              setNullableCheckbox(prev => !prev);
                            }}
                            className="appearance-none block px-2 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                          onClick={() => setOpenAdd(false)}
                          ref={cancelButtonRef}
                        >
                          Cancel
                        </button>
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

export default AddProperty;
