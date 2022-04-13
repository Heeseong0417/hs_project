import React, {useEffect} from 'react';

type Props = {
  register: Function;
  setValue: Function;
  property: any;
};

const StringInputForm = ({register, setValue, property}: Props) => {
  useEffect(() => {
    if (property.pattern) {
      setValue('pattern', property.pattern);
    }
    if (property.enum) {
      if (property.enum.length !== 0) {
        setValue('enum', property.enum.join(', '));
      }
    }
    if (property.minLength) {
      setValue('minLength', property.minLength);
    }
    if (property.maxLength) {
      setValue('maxLength', property.maxLength);
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
          Pattern
        </label>
        <div className="mt-2">
          <input
            {...register('pattern')}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Pattern"
          />
        </div>
      </div>

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
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 text-left"
        >
          minLength
        </label>
        <div className="mt-2">
          <input
            type="number"
            {...register('minLength')}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="minLength"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 text-left"
        >
          maxLength
        </label>
        <div className="mt-2">
          <input
            type="number"
            {...register('maxLength')}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="maxLength"
          />
        </div>
      </div>
    </>
  );
};

export default StringInputForm;
