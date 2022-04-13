import {Dispatch, SetStateAction} from 'react';

type Props = {
  title: string;
  register: Function;
  register_name: string;
  options: string[];
};

const ListSelectButton = ({title, register, register_name, options}: Props) => (
  <>
    <label
      htmlFor="target_server"
      className="block text-sm font-medium text-gray-700"
    >
      {title}
    </label>
    <select
      {...register(register_name, {
        required: true,
      })}
      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    >
      {options.map((option, key) => (
        <option key={key}>{option}</option>
      ))}
    </select>
  </>
);

export default ListSelectButton;
