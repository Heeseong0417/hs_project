import React, {useEffect} from 'react';

type Props = {
  register: Function;
  setValue: Function;
  property: any;
};

const ObjectInputForm = ({register, setValue, property}: Props) => {
  useEffect(() => {
    if (property.minProperties) {
      setValue('minProperties', property.minProperties);
    }
    if (property.maxProperties) {
      setValue('maxProperties', property.maxProperties);
    }
    return () => {};
  }, []);

  return (
    <>
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 text-left"
        >
          minProperties
        </label>
        <div className="mt-2">
          <input
            type="number"
            step="1"
            {...register('minProperties')}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="minProperties"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 text-left"
        >
          maxProperties
        </label>
        <div className="mt-2">
          <input
            type="number"
            step="1"
            {...register('maxProperties')}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="maxProperties"
          />
        </div>
      </div>
    </>
  );
};

export default ObjectInputForm;
