import {useState} from 'react';
import {UseFormSetValue} from 'react-hook-form';
import SelectSchemaFile from '../../project/SelectSchemaFile';
import {ValidationInputs} from '../TestMainList';

type Props = {
  title: string;
  register: Function;
  register_name: string;
  ipcSendString: string;
  setValue?: UseFormSetValue<ValidationInputs>;
};

const PathSelectButton = ({
  title,
  register,
  register_name,
  ipcSendString,
  setValue,
}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <label
        htmlFor="dataset-dirpath"
        className="block text-sm font-medium text-gray-700"
      >
      
        {title}
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <button
          onClick={() => {
            setOpen(true);
          }}
          type="button"
          // onClick={() => {
          //   global.ipcRenderer.send('selectFilePath', ipcSendString);
          // }}
          className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-red-900 font-bold  text-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          경로선택
        </button>
        <input
          {...register(register_name, {
            required: true,
          })}
          // defaultValue="12323"
          type="text"
          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
        />
        {open ? <SelectSchemaFile open={open} setOpen={setOpen} /> : null}
      </div>
    </>
  );
};

export default PathSelectButton;
