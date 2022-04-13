import {Dispatch, SetStateAction} from 'react';

type Props = {
  title: string;
  description: string;
  register: Function;
  register_name: string;
};

const CheckBoxButton = ({
  title,
  description,
  register,
  register_name,
}: Props) => (
  <div className="relative flex items-start">
    <div className="flex items-center h-5">
      <input
        {...register(register_name)}
        defaultChecked={true}
        type="checkbox"
        checked
        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
      />
    </div>
    <div className="ml-3 text-sm">
      <label htmlFor="comments" className="font-medium text-gray-700">
        {title}
      </label>
      <p className="text-gray-500">{description}</p>
    </div>
  </div>
);

export default CheckBoxButton;
