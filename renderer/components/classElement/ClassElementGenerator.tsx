import {Dispatch, SetStateAction} from 'react';

type PropClassElements = {
  path: string;
  value: string;
  type?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  enum?: string[];
  maximum?: number;
  minimum?: number;
  exclusiveMaximum?: boolean;
  exclusiveMinimum?: boolean;
};

type Props = {
  schemaJson: any;
  //   classElements: PropClassElements[];
  //   setClassElements: Dispatch<SetStateAction<PropClassElements[]>>;
};

const ClassElementGenerator = ({
  schemaJson,
}: //   classElements,
//   setClassElements,
Props) => {
  return <div className="">hongman</div>;
};

export default ClassElementGenerator;
