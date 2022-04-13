import MainAside from '../../components/main/MainAside';
import PinnedProject_ex from '../../components/Excels/print_test/PinnedProject_ex';
import ProjectLists_ex from '../../components/Excels/print_test/ProjectLists_ex';
import MainTitleAction from '../../components/main/MainTitleAction';
import {useEffect, useState} from 'react';
import NewProject from '../../components/project/newProject';
import {navigation} from '../../components/libs/menu';

export type VailentProject = {
  id: number;
  title: string;
  type: string;
  pinned: boolean;
  lastUpdated: string;
};

// const pinnedProjects = projects.filter((project) => project.pinned);

export default function Index() {
  const [isNewProject, setIsNewProject] = useState(false);
  const [projects, setProjects] = useState<VailentProject[]>([]);
  const [pinnedProjects, setPinnedProjects] = useState<VailentProject[]>([]);

  navigation.forEach(nav =>
    nav.name === 'Project' ? (nav.current = true) : (nav.current = false),
  );

  useEffect(() => {
    console.log('start');
    global.ipcRenderer.send('projectRead');
    global.ipcRenderer.addListener('projectRead', (_event, data) => {
      if (data) {
        const projects = data.datas;
        console.log(data);
        // console.log(JSON.parse(data));
        setProjects(projects);
        setPinnedProjects(projects.filter(project => project.pinned));
      }
    });

    return () => {
      global.ipcRenderer.removeAllListeners('projectRead');
    };
  }, []);

  return (
    <div className="min-h-full">
     
      {/* Static sidebar for desktop */}
      <MainAside navigation={navigation} />
      {/* Main column */} 
      
      <div className="pl-64 flex flex-col">
        {/* Search header */}
        <main className="flex-1">
          {/* Page title & actions */}
          <MainTitleAction setIsNewProject={setIsNewProject} />
          <div>
        엑셀test를 위한 page 입니다.
      </div>
          {/* Pinned projects */}
          <PinnedProject_ex pinnedProjects={pinnedProjects} />

          {/* Projects list */}
          <ProjectLists_ex
            projects={projects}
            setProjects={setProjects}
            setPinnedProjects={setPinnedProjects}
          />
        </main>
      </div>
      {isNewProject ? (
        <NewProject
          isNewProject={isNewProject}
          setIsNewProject={setIsNewProject}
          setProjects={setProjects}
          setPinnedProjects={setPinnedProjects}
          projects={projects}
        />
      ) : null}
    </div>
  );
}
