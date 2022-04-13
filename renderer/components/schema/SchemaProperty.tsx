import React from 'react';
import {useForm} from 'react-hook-form';

type Props = {
  property: any;
  name: string;
  required: boolean;
  //   jsonSchema: object;
};

const SchemaProperty = ({property, name, required}: Props) => {
  // console.log(property);
  const {register, handleSubmit} = useForm();
  const onSubmit = data => {
    alert(JSON.stringify(data));
  };

  return (
    <div className="flex justify-between">
      <div className="flex gap-x-2 items-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            className="text-sm rounded-md shadow-sm"
            type="text"
            placeholder="title"
            {...register('name')}
          />
          <select
            className="text-sm rounded-md shadow-sm"
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
          <input
            type="checkbox"
            // checked={required}
            {...register('required')}
          ></input>
          Required
          {required}
        </form>
      </div>
      <div className="flex gap-x-4">
        <button>Edit</button>
        <button>Del</button>
      </div>
    </div>
  );
};

export default SchemaProperty;
