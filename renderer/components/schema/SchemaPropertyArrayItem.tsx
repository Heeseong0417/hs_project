import {Dispatch, useState} from 'react';
import {useForm} from 'react-hook-form';
import AddProperty from './AddProperty';
import EditProperty from './EditProperty';
import SchemaPropertyItem from './SchemaPropertyItem';

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

const SchemaPropertyArrayItem = ({
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
    console.log('delete');
    const tmpSchemaData = Object.assign({}, schemaData);

    let tmpObj = tmpSchemaData;
    for (let i = 0; i < parent.length; i++) {
      if (parent[i].type === 'object' || parent[i].type === 'array') {
        tmpObj = tmpObj['properties'][parent[i].name];
      }
    }
    console.log(tmpObj.type);
    if (tmpObj.type === 'array') {
      if (Array.isArray(tmpObj['items'])) {
        const order = parseInt(name.split('Item ')[1]);
        tmpObj = tmpObj['items'][order];
      } else {
        delete tmpObj.items;
      }
    } else {
      delete tmpObj.properties[name];
    }
    setSchemaData(tmpSchemaData);
  };

  const changeName = e => {};
  return (
    <div className=" pl-4 py-1 flex flex-col">
      <div className="flex justify-between hover:bg-red-100">
        <div className="flex gap-x-2 items-end">
          <button
            className="flex  gap-x-2 items-end"
            onClick={() => {
              setOpenChildProp(prep => !prep);
            }}
          >
            {property.type === 'object' || property.type === 'array'
              ? openChildProp
                ? 'v'
                : '>'
              : '-'}
            <h3 className="text-xl">
              {name} {required ? <span className="text-red-600">*</span> : null}
            </h3>
            <span className="text-sm">({property.type})</span>
          </button>
          {/* <h3 className="text-xl">
              {name} {required ? <span className="text-red-600">*</span> : null}
            </h3>
            <span className="text-sm">({property.type})</span> */}
        </div>
        <div className="flex gap-x-4">
          {property.type === 'array' ? (
            <button onClick={clickAddProperty}>Add</button>
          ) : null}
          <button onClick={clickEditProperty}>Edit</button>
          <button onClick={clickDeleteProperty}>Del</button>
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
          {Object.getOwnPropertyNames(property.properties).map((prop, key) => (
            <SchemaPropertyItem
              key={key}
              property={property.properties[prop]}
              parent={newParent}
              name={prop}
              required={
                property.required
                  ? property.required.find(required => required == property)
                    ? true
                    : false
                  : false
              }
              setSchemaData={setSchemaData}
              schemaData={schemaData}
            />
          ))}
        </div>
      ) : null}
      {property.type === 'array' && Array.isArray(property.items)
        ? property.items.map((prop, key) => (
            <SchemaPropertyArrayItem
              key={key}
              property={prop.items}
              parent={newParent}
              name={key}
              required={false}
              setSchemaData={setSchemaData}
              schemaData={schemaData}
            />
          ))
        : null}
      {property.type === 'array' && !Array.isArray(property.items) ? (
        <SchemaPropertyArrayItem
          property={property.items}
          parent={newParent}
          name="0"
          required={false}
          setSchemaData={setSchemaData}
          schemaData={schemaData}
        />
      ) : null}
    </div>
  );
};

export default SchemaPropertyArrayItem;
