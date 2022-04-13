import React, {useEffect} from 'react';

type Props = {
  register: Function;
  setValue: Function;
  property: any;
};

const NumberInputForm = ({register, setValue, property}: Props) => {
  useEffect(() => {
    if (property.enum) {
      setValue('enum', property.enum);
    }
    if (property.minimum) {
      setValue('minimum', property.minimum);
    }
    if (property.maximum) {
      setValue('maximum', property.maximum);
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
          Enum
        </label>
        <div className="mt-2">
          <input
            {...register('enum')}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enum list (aaa, bbb, ccc, ...)"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="minimum"
          className="block text-sm font-medium text-gray-700 text-left"
        >
          minimum
        </label>
        <div className="mt-2">
          <input
            type="number"
            {...register('minimum')}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="minimum"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="maximum"
          className="block text-sm font-medium text-gray-700 text-left"
        >
          maximum
        </label>
        <div className="mt-2">
          <input
            type="number"
            {...register('maximum')}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="maximum"
          />
        </div>
      </div>
    </>
  );
};

export default NumberInputForm;
