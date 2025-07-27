import React, { useState, useRef } from "react";
import styled from "styled-components";

// Project data
const projects = [
  {
    id: 1,
    name: "Project A",
    desc: "Description A",
    color: "tomato",
    url: "#",
    initialPosition: { x: 100, y: 100 },
  },
  {
    id: 2,
    name: "Project B",
    desc: "Description B",
    color: "skyblue",
    url: "#",
    initialPosition: { x: 300, y: 100 },
  },
  {
    id: 3,
    name: "Project C",
    desc: "Description C",
    color: "limegreen",
    url: "#",
    initialPosition: { x: 500, y: 100 },
  },
];

const ProjectsContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f40c3f 0%, #5a0c3f 100%);
  padding: 2rem;
`;

const CanvasArea = styled.div`
  flex: 1;
  position: relative;
  height: 600px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const ProjectCard = styled.div`
  position: absolute;
  width: 200px;
  height: 120px;
  border-radius: 8px;
  padding: 1rem;
  cursor: grab;
  user-select: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:active {
    cursor: grabbing;
    transform: scale(1.02);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }

  h3 {
    margin: 0;
    color: white;
    font-size: 1.2rem;
  }

  p {
    margin: 0.5rem 0 0;
    color: white;
    font-size: 0.9rem;
    opacity: 0.9;
  }
`;

const InfoPanel = styled.div`
  flex: 1;
  padding: 2rem;
  margin-left: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;

  h2 {
    margin-top: 0;
  }

  .project-link {
    display: inline-block;
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-2px);
    }
  }
`;

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectPositions, setProjectPositions] = useState(
    projects.reduce((acc, project) => {
      acc[project.id] = project.initialPosition;
      return acc;
    }, {})
  );

  const dragStartPos = useRef(null);
  const draggedProjectId = useRef(null);

  const handleMouseDown = (e, projectId) => {
    e.preventDefault();
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    draggedProjectId.current = projectId;
    setSelectedProject(projects.find((p) => p.id === projectId));
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!dragStartPos.current || !draggedProjectId.current) return;

    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;

    setProjectPositions((prev) => ({
      ...prev,
      [draggedProjectId.current]: {
        x: prev[draggedProjectId.current].x + dx,
        y: prev[draggedProjectId.current].y + dy,
      },
    }));

    dragStartPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    dragStartPos.current = null;
    draggedProjectId.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleDoubleClick = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    setProjectPositions((prev) => ({
      ...prev,
      [projectId]: project.initialPosition,
    }));
  };

  return (
    <ProjectsContainer>
      <CanvasArea>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            style={{
              backgroundColor: project.color,
              left: `${projectPositions[project.id].x}px`,
              top: `${projectPositions[project.id].y}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, project.id)}
            onDoubleClick={() => handleDoubleClick(project.id)}
          >
            <h3>{project.name}</h3>
            <p>{project.desc}</p>
          </ProjectCard>
        ))}
      </CanvasArea>

      <InfoPanel>
        <h2>Project Info</h2>
        {selectedProject ? (
          <>
            <h3 style={{ color: selectedProject.color }}>
              {selectedProject.name}
            </h3>
            <p>{selectedProject.desc}</p>
            <a
              href={selectedProject.url}
              className="project-link"
              style={{ backgroundColor: selectedProject.color }}
            >
              View Project
            </a>
          </>
        ) : (
          <p>Select a project card to see details</p>
        )}
      </InfoPanel>
    </ProjectsContainer>
  );
};

export default Projects;
