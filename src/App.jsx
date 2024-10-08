// import React, { useState } from "react";
// import NoteForm from "./components/NoteForm";
// import Note from "./components/Node";
// import "./styles/App.css";

// const App = () => {
//   const [workflows, setWorkflows] = useState([]);
//   const [selectedWorkflowId, setSelectedWorkflowId] = useState(null);
//   const [nodes, setNodes] = useState([]);
//   const [selectedNoteId, setSelectedNoteId] = useState(null);
//   const [noteData, setNoteData] = useState({});


//   const handleCreateWorkflow = async () => {
//     const newWorkflow = {
//       workflow_name: `Workflow ${workflows.length + 1}`,
//       team_id: "fe627eb7-64c9-4691-9a04-02ddefb5bc8a",
//       workflow_information: {},
//       status: "ready",
//     };

//     try {
//       const response = await fetch("https://qa.govoyr.com/api/workflow", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newWorkflow),
//       });

//       const data = await response.json();

//       // Add the new workflow to the state
//       setWorkflows((prevWorkflows) => [...prevWorkflows, data]);

//       // Set the new workflow as the selected workflow
//       setSelectedWorkflowId(data.workflow_id);
//       localStorage.setItem('selectedWorkflowId', data.workflow_id);
//       console.log("work id", data.workflow_id);
//       // Initialize nodes for the new workflow
//       setNodes([]); // Clear nodes for the new workflow
//       setNoteData({});
//     } catch (error) {
//       console.error("Error creating workflow:", error);
//     }
//   };

//   const handleCreateNode = async (id) => {
//     const nodeToSave = nodes.find(node => node.id === id);
//     if (!nodeToSave) return;

//     await fetch('https://qa.govoyr.com/api/node', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         node_name: `Node ${id}`,
//         system_prompt: "",
//         organization: 'Claude',
//         model_name: 'claude-3-haiku-20240307',
//         workflow_id: `${selectedWorkflowId}`,
//         position: `${id}`,
//         status: 'ready',
//       }),
//     });

//     console.log('Node saved to API:', id);
//     setSelectedNoteId(null);
//   };

//   const addNote = (parentNodeId = null) => {
//     const parentNode = nodes.find((node) => node.id === parentNodeId);
//     let newPosition = { x: 100, y: 100 };

//     if (parentNode) {
//       newPosition = {
//         x: parentNode.position.x + 300,
//         y: parentNode.position.y,
//       };
//     }

//     const newNode = {
//       id: nodes.length + 1,
//       position: newPosition,
//       text: '',
//       parent: parentNodeId,
//     };
//     setSelectedNoteId(newNode.id);

//     setNodes((prevNodes) => [...prevNodes, newNode]);
//     setNoteData((prevData) => ({
//       ...prevData,
//       [newNode.id]: {
//         what: '',
//         how: '',
//         using: '',
//         name: '',
//         to: '',
//       },
//     }));
//   };

//   const deleteNote = (id) => {
//     setNodes((prevNotes) => prevNotes.filter((note) => note.id !== id));
//   };

//   const handleHeaderClick = (id) => {
//     setSelectedNoteId(id);
//   };

//   const handleNoteFormChange = (updatedData) => {
//     setNoteData((prevData) => ({
//       ...prevData,
//       [selectedNoteId]: updatedData,
//     }));
//   };

//   const handleNodeDrag = (id, newPosition) => {
//     setNodes((prevNodes) =>
//       prevNodes.map((node) =>
//         node.id === id ? { ...node, position: newPosition } : node
//       )
//     );
//   };

//   return (
//     <div className="app-container">
//       <button
//         className="create-workflow-btn"
//         onClick={handleCreateWorkflow}
//       >
//         Create New Workflow
//       </button>

//       {selectedWorkflowId && (
//         <div className="workflow-container">
//           <button className="create-node-btn" onClick={() => addNote(null)}>
//             Create New Node
//           </button>

//           <div>
//             {selectedNoteId !== null && (
//               <NoteForm
//                 id={selectedNoteId}
//                 initialData={noteData[selectedNoteId]}
//                 onSave={handleNoteFormChange}
//               />
//             )}

//             {nodes.map((node) => {
//               const parentNode = nodes.find((n) => n.id === node.parent);

//               return (
//                 <React.Fragment key={node.id}>
//                   <Note
//                     id={node.id}
//                     title={`Node ${node.id}`}
//                     content={noteData[node.id]}
//                     position={node.position}
//                     onDelete={deleteNote}
//                     onHeaderClick={handleHeaderClick}
//                     onAddNote={addNote}
//                     onCreateNote={handleCreateNode}
//                     onDrag={handleNodeDrag} // Pass the drag handler
//                   />

//                   {parentNode && (
//                     <div
//                       className="thread"
//                       style={{
//                         position: "absolute",
//                         width: `${
//                           node.position.x - parentNode.position.x - 240
//                         }px`,
//                         height: "2px",
//                         backgroundColor: "white",
//                         left: `${parentNode.position.x + 250}px`,
//                         top: `${parentNode.position.y + 135}px`,
//                       }}
//                     />
//                   )}
//                 </React.Fragment>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;


import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WorkflowPage from "./pages/WorkFlow"; 
import Home from "./pages/Home";
import "./styles/App.css";
import { ContentProvider } from '../ContentContest'; 
import { useContentContext } from "../ContentContest";

const App = () => {
  const {
    workflows, 
    setWorkflows,
    selectedWorkflowId, 
    setSelectedWorkflowId
  } = useContentContext(); 

  return (
      <Router>
        <div className="app-container">
          <Routes>
            {/* Home route */}
            <Route 
              path="/" 
              element={
                <Home 
                  workflows={workflows} 
                  setWorkflows={setWorkflows} 
                  setSelectedWorkflowId={setSelectedWorkflowId} 
                />
              } 
            />

            {/* Workflow page route */}
            <Route 
              path="/:workflowId" 
              element={<WorkflowPage selectedWorkflowId={selectedWorkflowId} />} 
            />
          </Routes>
        </div>
      </Router>
  );
};

export default App;


