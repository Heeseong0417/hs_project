import React, {Dispatch, SetStateAction} from 'react';
import {PropClassElements} from '../test/TestMainList';

type Props = {
  classElements: PropClassElements[];
  setClassElements: Dispatch<SetStateAction<PropClassElements[]>>;
  setIsCurrentClass: Dispatch<
    SetStateAction<{
      name: string;
      type: string;
      currentPath: string;
    }>
  >;
  setClassValueInput: Dispatch<React.SetStateAction<string>>;
};

const ClassElementTableView = ({
  classElements,
  setClassElements,
  setIsCurrentClass,
  setClassValueInput,
}: Props) => {
  const classElementDelete = ({path}: PropClassElements) => {
    const deleteClassElement = classElements.filter(
      classElement => classElement.path !== path,
    );
    setClassElements(deleteClassElement);
  };

  const classElementEdit = ({path, value}: PropClassElements) => {
    const name = path.split('/')[path.length - 1];
    setIsCurrentClass({
      name,
      type: '',
      currentPath: path,
    });
    setClassValueInput(value);
  };

  return (
    <>
      {classElements && classElements.length !== 0 ? (
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className=" align-middle inline-block min-w-full">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-2 text-left  tracking-wider"
                      >
                        <p className="text-xs font-medium text-gray-800 uppercase">
                          Path
                        </p>
                        <p className="text-xs font-medium text-gray-500 uppercase">
                          {`>`} Class
                        </p>
                      </th>

                      <th
                        scope="col"
                        className="relative px-6 py-2 text-center"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                      <th
                        scope="col"
                        className="relative px-6 py-2 text-center"
                      >
                        <span className="sr-only">Delete</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {classElements.map((classElement, classElementIdx) => (
                      <tr
                        key={classElementIdx}
                        className={
                          classElementIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }
                      >
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                          <p className="mb-2 text-gray-900">
                            {classElement.path}
                          </p>
                          <p className="text-gray-600">
                            {`>`} {classElement.value}
                          </p>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium w-8">
                          <a
                            onClick={() => {
                              classElementDelete(classElement);
                            }}
                            className="text-red-600 hover:text-red-900 cursor-pointer"
                          >
                            Delete
                          </a>
                        </td>

                        <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium w-8">
                          <a
                            onClick={() => {
                              classElementEdit(classElement);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                          >
                            Edit
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default ClassElementTableView;
