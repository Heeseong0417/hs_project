import React, {useEffect} from 'react';

type Props = {
  register: Function;
  setValue: Function;
  property: any;
};

const ArrayInputForm = ({register, setValue, property}: Props) => {
  useEffect(() => {
    if (property.minItems) {
      setValue('minItems', property.minItems);
    }
    if (property.maxItems) {
      setValue('maxItems', property.maxItems);
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
          minItems
        </label>
        <div className="mt-2">
          <input
            type="number"
            step="1"
            {...register('minItems')}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="minItems"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 text-left"
        >
          maxItems
        </label>
        <div className="mt-2">
          <input
            type="number"
            step="1"
            {...register('maxItems')}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="maxItems"
          />
        </div>
      </div>
    </>
  );
};

export default ArrayInputForm;
