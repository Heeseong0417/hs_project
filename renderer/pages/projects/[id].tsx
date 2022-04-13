import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import ProjectMain from '../../components/project/projectMain';
import ResultView from '../../components/project/resultView';
import TestAside from '../../components/test/TestAsice';
import TestMainList from '../../components/test/TestMainList';

export type JobListProp = {
  id: number;
  status: string;
  date: string;
  resultfilePath: string;
  errMsg?: string;
};

const getIdFromRouter = (str: string | string[]) => {
  let result: number;
  if (typeof str === 'string') {
    result = Number(str);
  } else {
    result = Number(str);
  }
  return result;
};

const ProjectDashboard = () => {
  const [jobLists, setJobLists] = useState<JobListProp[]>([]);
  const router = useRouter();
  const [selectJobId, setSelectJobId] = useState<string | string[]>(null);
  const [selectJob, setSelectJob] = useState<JobListProp>();

  const [projectTitle, setProjectTitle] = useState<string | string[]>(
    'Untitled',
  );
  const [selectProjectId, setSelectProjectId] = useState<string | string[]>(
    null,
  );

  useEffect(() => {
    global.ipcRenderer.addListener('jobList', (_event, args: any) => {
      setJobLists(args.jobs);
    });
    global.ipcRenderer.addListener(
      'getProjectTitle',
      (_event, title: string) => {
        console.log(title);
        setProjectTitle(title);
      },
    );

    return () => {
      global.ipcRenderer.removeAllListeners('jobList');
      global.ipcRenderer.removeAllListeners('getProjectTitle');
    };
  }, []);

  useEffect(() => {
    // console.log(router);
    if (router.isReady) {
      if (router.query.jobId) {
        setSelectJobId(router.query.jobId);
      }
      if (selectJobId) {
        const tmpJob = jobLists.find(
          job => job.id === getIdFromRouter(selectJobId),
        );
        setSelectJob(tmpJob);
      }

      setSelectProjectId(router.query.id);

      console.log(router.query.id);
      if (typeof router.query.id === 'string') {
        global.ipcRenderer.send('getProjectTitle', parseInt(router.query.id));
      }
      global.ipcRenderer.send('jobList', {id: router.query.id});
    }
  }, [router]);

  return (
    <div className=" flex overflow-hidden h-full">
      {/* Static sidebar for desktop */}
      <TestAside
        jobs={jobLists}
        projectTitle={projectTitle}
        selectProjectId={selectProjectId}
      />
      {router.isReady ? (
        <>
          {/* Main for desktop */}
          <section className="flex pl-64 flex-col w-full h-full bg-gray-100">
            {/* <TestMainTop /> */}
            
            {selectJobId === null ? (
              <ProjectMain selectProjectId={selectProjectId} />
            ) : selectJobId === 'new' ? (
              <TestMainList
                projectId={selectProjectId}
                setSelectJobId={setSelectJobId}
                projectTitle={projectTitle}
              />
            ) : (
              <ResultView jobId={selectJobId} jobLists={jobLists} />
            )}
          </section>
        </>
      ) : null}
    </div>
  );
};

export default ProjectDashboard;
