import {useEffect, useRef, useState} from 'react';
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

const DataSetPathSelectButton = ({
  title,
  register,
  register_name,
  ipcSendString,
  setValue,
}: Props) => {
  // const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [fileCount, setFileCount] = useState(null);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current !== null) {
      ref.current.setAttribute('directory', '');
      ref.current.setAttribute('webkitdirectory', '');
    }
  }, [ref]);

  const clickDir = event => {
    const {path, name} = event.target.files[0];
    console.log(path);
    console.log(name);
    const dir = path.replace(name, '');
    console.log(dir);
    setValue('target_directory', dir);
    setInputText(dir);
    // const {path, name, webkitRelativePath} = event.target.files[0];

    // const parentDir = path.replace(webkitRelativePath, '');
    // // const currentDir = parentDir + webkitRelativePath.split('/')[0] + '/';
    // const currentDir = parentDir + webkitRelativePath.split('\\')[0] + '\\';

    // setValue('target_directory', currentDir);
    // setInputText(currentDir);
    setFileCount(event.target.files.length);
  };

  const setFilePath = event => {
    setInputText(event.target.value);
    setValue('target_directory', event.target.value);
  };

  return (
    <>
      <p className="block text-sm font-medium text-gray-700">
        {title} {fileCount ? `(Total ${fileCount} files)` : null}
      </p>
      <div className="flex mt-1">
        <label className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-red-900 font-bold  text-sm focus:ring-indigo-500 focus:border-indigo-500">
          경로선택
          <input onChange={clickDir} ref={ref} type="file" className="hidden" />
        </label>
        <input
          value={inputText}
          onChange={setFilePath}
          type="text"
          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
        />
      </div>
    </>
  );
};

export default DataSetPathSelectButton;
