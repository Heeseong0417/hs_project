import {ChevronRightIcon} from '@heroicons/react/outline';
import Link from 'next/link';
import {Dispatch, SetStateAction, useState} from 'react';
import {VailentProject} from '../../../pages';
import DeleteProject from '../../project/deleteProject';
import EditProject from '../../project/editProject';

type Props = {
  projects: VailentProject[];
  setProjects: Dispatch<SetStateAction<VailentProject[]>>;
  setPinnedProjects: Dispatch<SetStateAction<VailentProject[]>>;
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const ProjectLists = ({projects, setProjects, setPinnedProjects}: Props) => {
  const [selectProject, setSelectProject] = useState<VailentProject>();
  const [editProjectId, setEditProjectId] = useState<Number>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<Number>(null);
  const [isEditProject, setIsEditProject] = useState(false);
  const [isDeleteProject, setIsDeleteProject] = useState(false);

  const selectEditProject = event => {
    const selectProjectId = parseInt(event.target.id);
    setEditProjectId(selectProjectId);
    setIsEditProject(true);

    const editProject = projects.find(
      project => project.id === selectProjectId,
    );
    console.log(editProject);

    setSelectProject(editProject);
  };
  const selectDeleteProject = event => {
    const selectProjectId = parseInt(event.target.id);
    setDeleteProjectId(selectProjectId);
    setIsDeleteProject(true);

    const deleteProject = projects.find(
      project => project.id === selectProjectId,
    );
    console.log(deleteProject);
    setSelectProject(deleteProject);
  };

  return (
    <>
      {/* Projects list (only on smallest breakpoint) */}
    
      <div className="mt-10 sm:hidden">
     
        <div className="px-4 sm:px-6">
          <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">
            Vaildate Projects
          </h2>
        </div>
        <ul
          role="list"
          className="mt-3 border-t border-gray-200 divide-y divide-gray-100"
        >
          {projects.map(project => (
            <li key={project.id}>
              <Link
                href={{
                  pathname: `/projects/${project.id}_ex`,
                  query: {title: project.title},
                }}
              >
                <a className="group flex items-center justify-between px-4 py-4 hover:bg-gray-50 sm:px-6">
                  <span className="flex items-center truncate space-x-3">
                    <span
                      className={classNames(
                        // project.bgColorClass,
                        'w-2.5 h-2.5 flex-shrink-0 rounded-full',
                      )}
                      aria-hidden="true"
                    />
                    <span className="font-medium truncate text-sm leading-6">
                      {project.title}
                    </span>
                  </span>
                  <ChevronRightIcon
                    className="ml-4 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Projects table (small breakpoint and up) */}
      <div className="hidden mt-8 sm:block">
        <div className="align-middle inline-block min-w-full border-b border-gray-200">
          <table className="min-w-full">
            <thead>
              <tr className="border-t border-gray-200">
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="lg:pl-2">Project</span>
                </th>
                <th className="hidden md:table-cell px-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last updated
                </th>
                <th className="pr-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" />
                <th className="pr-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {projects.map(project => (
                <tr key={project.id}>
                  <td className="px-6 py-3 max-w-0 w-full whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center space-x-3 lg:pl-2">
                      <div
                        className={classNames(
                          // project.bgColorClass,
                          'flex-shrink-0 w-2.5 h-2.5 rounded-full',
                        )}
                        aria-hidden="true"
                      />
                      <Link
                        href={{
                          pathname: `/projects/${project.id}_ex`,
                          query: {title: project.title},
                        }}
                      >
                        <a className="truncate hover:text-gray-600 w-full">
                          <span>{project.title} </span>
                        </a>
                      </Link>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                    {project.lastUpdated}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={selectEditProject}
                      id={project.id.toString()}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={selectDeleteProject}
                      id={project.id.toString()}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {editProjectId !== null ? (
          <EditProject
            isEditProject={isEditProject}
            setIsEditProject={setIsEditProject}
            setProjects={setProjects}
            projects={projects}
            selectProject={selectProject}
            setPinnedProjects={setPinnedProjects}
          />
        ) : null}
        {deleteProjectId !== null ? (
          <DeleteProject
            isDeleteProject={isDeleteProject}
            setIsDeleteProject={setIsDeleteProject}
            setProjects={setProjects}
            projects={projects}
            selectProject={selectProject}
            setPinnedProjects={setPinnedProjects}
          />
        ) : null}
      </div>
    </>
  );
};

export default ProjectLists;
