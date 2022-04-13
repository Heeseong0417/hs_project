import {Dispatch, SetStateAction} from 'react';

type Props = {
  projectId: string | string[];
  setSelectJobId: Dispatch<SetStateAction<string | string[]>>;
};

const TestMain = ({projectId, setSelectJobId}: Props) => null;

export default TestMain;
