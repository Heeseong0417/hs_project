import React from 'react';

type Props = {
  //   jsonSchema: object;
};

const SchemaStringProperty = ({}: Props) => {
  return (
    <div className="flex justify-between">
      <div className="flex gap-x-2 items-center">
        <input
          className="text-sm rounded-md shadow-sm"
          type="text"
          placeholder="title"
        />
        <select className="text-sm rounded-md shadow-sm">
          <option>object</option>
          <option selected>string</option>
          <option>number</option>
          <option>array</option>
          <option>integer</option>
          <option>boolean</option>
          <option>null</option>
        </select>
        <input type="checkbox"></input>
        Required
      </div>
      <div className="flex gap-x-4">
        <button>Edit</button>
        <button>Del</button>
      </div>
    </div>
  );
};

export default SchemaStringProperty;
