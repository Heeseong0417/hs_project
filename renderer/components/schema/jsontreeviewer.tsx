import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useState,
} from 'react';
import {CurreentClass} from '../hooks/useCurrentClass';

type PropsListGenWithElementType = {
  data: any;
  type: any;
  childen: any;
  setIsCurrentClass: Dispatch<SetStateAction<CurreentClass>>;
  isCurrentClass: CurreentClass;
  currentPath: string;
  setInputFocus: () => void;
};

function PropsListGenWithElement({
  data,
  type,
  childen,
  setIsCurrentClass,
  isCurrentClass,
  currentPath,
  setInputFocus,
}: PropsListGenWithElementType) {
  const classElements = [];

  const childenNew = childen.properties;

  for (const key in childenNew) {
    if (Object.hasOwnProperty.call(childenNew, key)) {
      const element = childenNew[key];
      if (!element.properties) {
        classElements.push({name: key, type: element.type});
      } else {
        classElements.push({name: key, type: element.type, element});
      }
    }
  }
  // console.log(data);

  return (
    <>
      <li key={data + Math.random().toString(36).substr(2, 5)} className="">
        {data}
      </li>
      <div
        // key={data + Math.random().toString(36).substr(2, 5)}
        className="ml-4"
      >
        {classElements.map(
          element =>
            element.element ? (
              <PropsListGenWithElement
                key={element.name + Math.random().toString(36).substr(2, 5)}
                data={element.name}
                type={element.type}
                childen={element.element}
                setIsCurrentClass={setIsCurrentClass}
                isCurrentClass={isCurrentClass}
                currentPath={currentPath + '/' + data}
                setInputFocus={setInputFocus}
              />
            ) : (
              <PropsListGen
                key={element.name + Math.random().toString(36).substr(2, 5)}
                data={element.name}
                type={element.type}
                setIsCurrentClass={setIsCurrentClass}
                currentPath={currentPath + '/' + data}
                setInputFocus={setInputFocus}
              />
            ),
          // <PropsListGen data={element.name} />
          // <li key={element.name}>{element.name}</li>
        )}
      </div>
    </>
  );
}

type PropsListGenType = {
  data: any;
  type: any;
  setIsCurrentClass: Dispatch<
    SetStateAction<{
      name: string;
      type: string;
      currentPath: string;
    }>
  >;
  currentPath: string;
  setInputFocus: () => void;
};

function PropsListGen({
  data,
  type,
  setIsCurrentClass,
  currentPath,
  setInputFocus,
}: PropsListGenType) {
  const [onButtonClick, setOnButtonClick] = useState(false);
  const onClassClick = () => {
    setIsCurrentClass(prevState => ({
      ...prevState,
      name: data,
      type: type,
      currentPath: currentPath + '/' + data,
    }));
    setOnButtonClick(true);
    setInputFocus();
  };

  return (
    <li key={data} className=" hover:bg-pink-100">
      <button
        type="button"
        onClick={onClassClick}
        className={
          onButtonClick ? 'font-bold bg-slate-300' : 'w-full text-left'
        }
      >
        <span>{`> ${data}`}</span>
      </button>
    </li>
  );
}

type JsonTreeViewerProp = {
  data: any;
  setIsCurrentClass: Dispatch<
    SetStateAction<{
      name: string;
      type: string;
      currentPath: string;
    }>
  >;
  isCurrentClass: CurreentClass;
  setInputFocus: () => void;
};

export default function JsonTreeViewer({
  data,
  setIsCurrentClass,
  isCurrentClass,
  setInputFocus,
}: JsonTreeViewerProp) {
  const classElements = [];
  const currentPath = '';

  if (!data.properties) {
    return <></>;
  }

  for (const key in data.properties) {
    if (Object.hasOwnProperty.call(data.properties, key)) {
      const element = data.properties[key];
      // console.log(element);

      if (!element.properties) {
        classElements.push({name: key, type: element.type});
      } else {
        classElements.push({name: key, type: element.type, element});
      }
    }
  }

  return (
    <>
      <h1 className="my-2">Class Tree View</h1>
      {classElements.map(element =>
        element.element ? (
          <PropsListGenWithElement
            key={element.name + Math.random().toString(36).substr(2, 5)}
            data={element.name}
            type={element.type}
            childen={element.element}
            setIsCurrentClass={setIsCurrentClass}
            isCurrentClass={isCurrentClass}
            currentPath={currentPath}
            setInputFocus={setInputFocus}
          />
        ) : (
          <PropsListGen
            key={element.name + Math.random().toString(36).substr(2, 5)}
            data={element.name}
            type={element.type}
            setIsCurrentClass={setIsCurrentClass}
            currentPath={currentPath}
            setInputFocus={setInputFocus}
          />
        ),
      )}
    </>
  );
}
