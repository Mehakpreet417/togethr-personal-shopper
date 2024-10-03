import React from "react";
import { useNavigate } from "react-router-dom";

const Home = ({ workflows, setWorkflows, setSelectedWorkflowId }) => {
  const navigate = useNavigate(); // useNavigate hook for programmatic navigation

  const handleCreateWorkflow = async () => {
    const newWorkflow = {
      workflow_name: `Workflow ${workflows.length + 1}`,
      team_id: "fe627eb7-64c9-4691-9a04-02ddefb5bc8a",
      workflow_information: {},
      status: "ready",
    };

    try {
      const response = await fetch("https://qa.govoyr.com/api/workflow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newWorkflow),
      });

      const data = await response.json();

      // Add the new workflow to the state
      setWorkflows((prevWorkflows) => [...prevWorkflows, data]);

      // Set the new workflow as the selected workflow
      setSelectedWorkflowId(data.workflow_id);
      localStorage.setItem('selectedWorkflowId', data.workflow_id);

      console.log("work id", data.workflow_id);

      // Use navigate to go to the newly created workflow page
      if (data.workflow_id) {
        navigate(`/${data.workflow_id}`); // Navigate to the new workflow's route
      }

    } catch (error) {
      console.error("Error creating workflow:", error);
    }
  };

  return (
    <div>
      <button className="create-workflow-btn" onClick={handleCreateWorkflow}>
        Create New Workflow
      </button>
    </div>
  );
};

export default Home;
