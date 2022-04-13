import {Dispatch} from 'react';

type Props = {
  isSummaryPage: string;
  setIsSummaryPage: Dispatch<React.SetStateAction<string>>;
};

const ResultNavbar = ({isSummaryPage, setIsSummaryPage}: Props) => {
  const buttonHandler = event => {
    setIsSummaryPage(event.target.id);
  };

  return (
    <div className="ml-6 flex justify-center space-x-8 ">
      {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}

      <a
        href="#"
        onClick={buttonHandler}
        id="summary"
        className={
          isSummaryPage === 'summary'
            ? 'border-indigo-500 text-gray-900 inline-flex items-center px-1 py-2 border-b-2 font-medium'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 font-medium'
        }
      >
        시험 결과 요약
      </a>
      <a
        href="#"
        onClick={buttonHandler}
        id="value"
        className={
          isSummaryPage === 'value'
            ? 'border-indigo-500 text-gray-900 inline-flex items-center px-1 py-2 border-b-2 font-medium'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 font-medium'
        }
      >
        통계검증 결과
      </a>
      <a
        href="#"
        onClick={buttonHandler}
        id="schema"
        className={
          isSummaryPage === 'schema'
            ? 'border-indigo-500 text-gray-900 inline-flex items-center px-1 py-2 border-b-2 font-medium'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 font-medium'
        }
      >
        구문검증 결과
      </a>
      <a
        href="#"
        onClick={buttonHandler}
        id="chart"
        className={
          isSummaryPage === 'chart'
            ? 'border-indigo-500 text-gray-900 inline-flex items-center px-1 py-2 border-b-2 font-medium'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 font-medium'
        }
      >
        시각화
      </a>
      {/* <a
      href="#"
      onClick={buttonHandler}
      className={
        isSummaryPage
          ? 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 font-medium'
          : 'border-indigo-500 text-gray-900 inline-flex items-center px-1 py-2 border-b-2 font-medium'
      }
    >
      검사 리스트 보기
    </a> */}
    </div>
  );
};

export default ResultNavbar;
