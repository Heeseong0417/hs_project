import {
  ChevronDownIcon,
  ChevronRightIcon,
  PlusCircleIcon,
  XCircleIcon,
} from '@heroicons/react/outline';
import {MinusSmIcon} from '@heroicons/react/solid';
import {Dispatch, useState} from 'react';
import {currentSchemaPos, currentSchemaPosDelete} from '../libs/schema';
import AddProperty from './AddProperty';
import EditProperty from './EditProperty';

export type ParentType = {
  name: string;
  type: string;
};

type Props = {
  property: any;
  name: string;
  parent: ParentType[];
  required: boolean;
  setSchemaData: Dispatch<any>;
  schemaData: any;
  //   jsonSchema: object;
};

const SchemaPropertyItem = ({
  property,
  name,
  parent,
  required,
  setSchemaData,
  schemaData,
}: Props) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openChildProp, setOpenChildProp] = useState(true);

  if (property === undefined) {
    return null;
  }

  const newParent = [...parent, {name, type: property.type}];

  const clickAddProperty = () => {
    setOpenAdd(true);
  };

  const clickEditProperty = () => {
    setOpenEdit(true);
  };

  const clickDeleteProperty = () => {
    // console.log('delete');
    const tmpSchemaData = Object.assign({}, schemaData);

    let tmpObj = currentSchemaPosDelete(parent, tmpSchemaData, name);

    if (tmpObj.type === 'array') {
      if (Array.isArray(tmpObj['items'])) {
        const order = parseInt(name.split('Item ')[1]);
        tmpObj['items'].splice(order, 1);

        if (tmpObj['items'].length == 0) {
          tmpObj['items'] = {};
        }
      } else {
        delete tmpObj.items;
      }
    } else {
      delete tmpObj[name];
    }
    // console.log(tmpSchemaData);
    setSchemaData(tmpSchemaData);
  };

  return (
    <div
      className={
        property.type === 'null' ? 'border-2 border-red-500 rounded-lg' : null
      }
    >
      <div className="flex py-1 justify-between hover:shadow hover:bg-red-100 pl-2 border-l-2 hover:pl-[6px]  hover:border-l-4 hover:border-red-400">
        {/* <div className="flex gap-x-2 items-end grow"> */}
        <div className="flex gap-x-2 items-end grow">
          <div className="h-full flex items-center">
            {property.type === 'object' || property.type === 'array' ? (
              openChildProp ? (
                <button
                  className="flex items-center pr-2"
                  onClick={() => {
                    setOpenChildProp(prep => !prep);
                  }}
                >
                  <ChevronDownIcon className="h-4 w-4 hover:font-bold" />
                </button>
              ) : (
                <button
                  className="flex items-center pr-2"
                  onClick={() => {
                    setOpenChildProp(prep => !prep);
                  }}
                >
                  <ChevronRightIcon className="h-4 w-4 " />
                </button>
              )
            ) : (
              <div className="flex items-center pr-2">
                <MinusSmIcon className="h-4 w-4" />
              </div>
            )}
          </div>
          <button
            className="flex gap-x-2 items-end grow"
            onClick={clickEditProperty}
          >
            <h3 className="text-xl">
              {name} {required ? <span className="text-red-600">*</span> : null}
            </h3>
            <span className="text-sm">({property.type})</span>
            {property.type === 'null' ? (
              <div className="text-sm text-red-500 font-bold">
                {' '}
                타입을 설정하세요.
              </div>
            ) : null}
            {/* </div> */}
            {/* <div className="grow"></div> */}
          </button>
        </div>
        <div className="flex gap-x-4">
          {property.type === 'object' || property.type === 'array' ? (
            <button
              // className="border border-gray-300 inline-flex items-center text-sm shadow-sm font-medium rounded-md px-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-orange-500 "
              onClick={clickAddProperty}
            >
              <PlusCircleIcon className="h-6 w-6 text-gray-500 hover:text-red-400" />
              {/* Add */}
            </button>
          ) : null}
          {/* <button
            className="border border-gray-300 inline-flex items-center text-sm shadow-sm font-medium rounded-md px-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-orange-500 "
            onClick={clickEditProperty}
          >
            Edit
          </button> */}
          <button
            // className="border border-gray-300 inline-flex items-center text-sm shadow-sm font-medium rounded-md px-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-orange-500 "
            onClick={clickDeleteProperty}
          >
            <XCircleIcon className="h-6 w-6 text-gray-500 hover:text-red-400" />
            {/* Del */}
          </button>
        </div>
        {openEdit ? (
          <EditProperty
            openEdit={openEdit}
            setOpenEdit={setOpenEdit}
            property={property}
            name={name}
            parent={parent}
            required={required}
            setSchemaData={setSchemaData}
            schemaData={schemaData}
          />
        ) : null}
        {openAdd ? (
          <AddProperty
            openAdd={openAdd}
            setOpenAdd={setOpenAdd}
            parent={newParent}
            setSchemaData={setSchemaData}
            schemaData={schemaData}
          />
        ) : null}
      </div>
      {property.type === 'object' ? (
        <div className={openChildProp ? '' : 'hidden'}>
          {property.properties
            ? Object.getOwnPropertyNames(property.properties).map(
                (prop, key) => (
                  <div className="pl-4 flex flex-col" key={key}>
                    <SchemaPropertyItem
                      property={property.properties[prop]}
                      parent={newParent}
                      name={prop}
                      required={
                        property.required
                          ? property.required.find(required => required == prop)
                            ? true
                            : false
                          : false
                      }
                      setSchemaData={setSchemaData}
                      schemaData={schemaData}
                    />
                  </div>
                ),
              )
            : null}
        </div>
      ) : null}
      {property.type === 'array' && Array.isArray(property.items) ? (
        <div className={openChildProp ? '' : 'hidden'}>
          {property.items.map((prop, key) => (
            <div className="pl-4 flex flex-col" key={key}>
              <SchemaPropertyItem
                property={prop}
                parent={newParent}
                name={`Item ${key}`}
                required={false}
                setSchemaData={setSchemaData}
                schemaData={schemaData}
              />
            </div>
          ))}
        </div>
      ) : null}
      {property.type === 'array' &&
      !Array.isArray(property.items) &&
      property.items &&
      property.items.type ? (
        <div className={openChildProp ? '' : 'hidden'}>
          <div className="pl-4 flex flex-col">
            <SchemaPropertyItem
              property={property.items}
              parent={newParent}
              name="Item 0"
              required={false}
              setSchemaData={setSchemaData}
              schemaData={schemaData}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SchemaPropertyItem;
