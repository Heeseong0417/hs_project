import {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react';
import JsonTreeViewer from './jsontreeviewer';
import useCurrentClass from '../hooks/useCurrentClass';
import {PropClassElements} from '../test/TestMainList';
import ClassElementTableView from './classElementList';
import useTextInputFocus from '../hooks/useTextInputFocus';

type Props = {
  schemaJson: any;
  classElements: PropClassElements[];
  setClassElements: Dispatch<SetStateAction<PropClassElements[]>>;
};

type StringTypeOption = {
  pattern?: string;
  enumList?: string;
  maxLength?: number;
  minLength?: number;
};

export default function JsonViewer({
  schemaJson,
  classElements,
  setClassElements,
}: Props) {
  const {isCurrentClass, setIsCurrentClass} = useCurrentClass({
    name: '',
    type: '',
    currentPath: '',
  });
  const [classValueInput, setClassValueInput] = useState('');
  const [currentClassSelector, setCurrentClassSelector] = useState(
    isCurrentClass.currentPath,
  );
  const [stringTypeOption, setStringTypeOption] = useState<StringTypeOption>({
    pattern: undefined,
    enumList: undefined,
    maxLength: undefined,
    minLength: undefined,
  });
  const selectTypes = ['array', 'string', 'number', 'integer'];
  const [selectType, setSelectType] = useState('');
  // const [selectTypes, setSelectType] = useState(['string', 'number', 'integer']);

  // class 클릭시 바로 입력할 수 있도록 커서 이동
  // const inputRef = useRef(null);
  const {inputRef, setInputFocus} = useTextInputFocus();

  useEffect(() => {
    setCurrentClassSelector(isCurrentClass.currentPath);
  }, [isCurrentClass]);

  const cancleClassElement = () => {
    setIsCurrentClass({
      name: '',
      type: '',
      currentPath: '',
    });
  };

  const classElementGen = () => {
    if (classValueInput.length === 0) {
      return;
    }
    let {type} = isCurrentClass;

    const tmpClassElements = classElements.filter(
      classElement => classElement.path === currentClassSelector,
    );
    let option = null;
    if (type === 'array') {
      // document.getElementById('arraySelete');
      type = selectType;
    }

    if (tmpClassElements.length !== 0) {
      const updatedData = classElements.map(x =>
        x.path === currentClassSelector
          ? {...x, value: classValueInput, type}
          : x,
      );
      setClassElements(updatedData);
    } else {
      setClassElements([
        // ...tmpClassElements,
        ...classElements,
        {
          path: currentClassSelector,
          value: classValueInput,
          type,
        },
      ]);
    }
    console.log(classElements);

    setClassValueInput('');
    setIsCurrentClass({
      name: '',
      type: '',
      currentPath: '',
    });
  };
  const handleSelectTypeChange = e => {
    setSelectType(selectTypes[e.target.value]);
    // console.log(selectTypes[e.target.value]);
  };

  const stringTypeOptionChange = event => {
    // const  .value;
    // console.log(event.target.name);
    // console.log(event.target.value);

    let newStringTypeOptions = stringTypeOption;
    newStringTypeOptions[event.target.name] =
      event.target.value === '' ? undefined : event.target.value;
    // console.log(newStringTypeOptions);

    setStringTypeOption(newStringTypeOptions);

    // setStringTypeOption( prevState => ({...prevState, entrie[0]: }))
  };

  return (
    <div className="grid grid-cols-3 gap-6 mt-4">
      <div className="col-span-1 px-5  pb-6 border-2 border-gray-300  rounded-md">
        <JsonTreeViewer
          data={schemaJson}
          setIsCurrentClass={setIsCurrentClass}
          isCurrentClass={isCurrentClass}
          setInputFocus={setInputFocus}
        />
      </div>
      <div className="col-span-2  px-6 pt-5 pb-6 border-2 border-gray-300  rounded-md">
        {isCurrentClass.name !== '' ? (
          <div className="flex flex-col gap-y-2">
            <div className="col-span-6 my-4">
              <label className="block text-sm font-medium text-gray-700">
                클래스 엘레민트(노드) 셀렉터
              </label>
              {/* <span className="text-xl mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm border-gray-300 rounded-md">
                {isCurrentClass.currentPath}
              </span> */}
              <input
                ref={inputRef}
                type="text"
                name="class-value"
                value={currentClassSelector}
                onChange={event => setCurrentClassSelector(event.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-700">
                타입
              </label>
              {isCurrentClass.type === 'array' ? (
                <select
                  id="arraySelete"
                  onChange={e => handleSelectTypeChange(e)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {selectTypes.map((option, key) => (
                    <option value={key} key={key}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-xl mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm border-gray-300 rounded-md">
                  {isCurrentClass.type}
                </span>
              )}
            </div>
            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-700">
                클래스 값(Value)
              </label>
              <input
                ref={inputRef}
                type="text"
                name="class-value"
                value={classValueInput}
                onChange={event => setClassValueInput(event.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                onKeyPress={event => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    classElementGen();
                  }
                }}
              />
            </div>
            {/* {isCurrentClass.type === 'string'
              ? Object.entries(stringTypeOption).map((entrie, idx) => (
                  <div key={idx} className="col-span-6">
                    <label className="block text-sm font-medium text-gray-700">
                      {entrie[0]}
                    </label>
                    <input
                      type="text"
                      name={entrie[0]}
                      value={entrie[1]}
                      onChange={stringTypeOptionChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                ))
              : null} */}
            <div className="col-span-6 flex mt-4 justify-end gap-x-2">
              <button
                type="button"
                onClick={cancleClassElement}
                className="items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                취소
              </button>
              <button
                type="button"
                onClick={classElementGen}
                className={`items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white   ${
                  classValueInput.length === 0
                    ? 'cursor-not-allowed bg-purple-200'
                    : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
                }`}
              >
                저장
              </button>
            </div>
          </div>
        ) : (
          <div>
            {classElements && classElements.length !== 0 ? (
              <ClassElementTableView
                classElements={classElements}
                setClassElements={setClassElements}
                setIsCurrentClass={setIsCurrentClass}
                setClassValueInput={setClassValueInput}
              />
            ) : (
              <h1>클래스 엘레민트를 선택해 주세요.</h1>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
