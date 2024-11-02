import React, { useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "react-flow-renderer";

const initialNodes = [];

const WorkflowEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeIdCounter, setNodeIdCounter] = useState(2);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNodeType, setSelectedNodeType] = useState("");
  const [formData, setFormData] = useState({});
  const [inputType, setInputType] = useState("string");
  const [sasUrl, setSasUrl] = useState(""); // State to store SAS URL
  const [blobName, setBlobName] = useState("");

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge({ ...params, arrowHeadType: 'arrow', markerEnd: { type: 'arrowclosed' } }, eds)
      ),
    [setEdges]
  );
  
  const onNodeClick = (event, node) => {
    console.log("Node clicked:", node);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNodeType("");
    setFormData({});
  };

  const handleNodeTypeChange = (event) => {
    setSelectedNodeType(event.target.value);
    setFormData({});
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleInputTypeChange = (e) => {
    setInputType(e.target.value);
  };

  const createSasUrl = async (file) => {
    const postData = {
      file_name: file.name,
    };

    try {
      const response = await fetch('https://qa.govoyr.com/api/sasUrl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate SAS URL');
      }

      const result = await response.json();
      setSasUrl(result.sas_url); // Store SAS URL
      setBlobName(result.blob_name); // Store Blob Name
      console.log("SAS URL:", result.sas_url);
      console.log("Blob Name:", result.blob_name);
      return result; // Return result for further processing

    } catch (error) {
      console.error("Error fetching SAS URL:", error);
    }
  };

  const uploadFileToSasUrl = async (file) => {
    console.log("url in put ", sasUrl)
    const url = await sasUrl; // Use the SAS URL obtained from the previous request
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': file.type, // Set the content type of the file
      },
      body: file, 
      mode: 'no-cors'// The actual file to upload
    };

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload file');
      }

      alert("File uploaded successfully!"); // Alert user on successful upload
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const createInputNode = async (file) => {
    // Call createSasUrl to get SAS URL and blob name
    const sasResult = await createSasUrl(file);
    if (!sasResult) return; // Exit if SAS URL generation failed

    const { blob_name } = sasResult; // Destructure blob name from result

    await uploadFileToSasUrl(file); 

    const workflowid = localStorage.getItem('selectedWorkflowId'); // Replace with the actual workflow ID

    const newNode = {
      id: `${nodeIdCounter}`,
      data: { label: `Input node_${nodeIdCounter}` }, // Node label
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };

    const nodePayload = {
      node_name: `Input node_${nodeIdCounter}`,
      node_type: "INPUT",
      next_node_ids: formData.next_node_ids ? formData.next_node_ids.split(",") : [],
      input_socket_list: [
        {
          is_structured: true,
          input_name: "context",
          input_description: "context for answering user query",
          is_static: false,
          next_node_socket_ids: formData.next_node_socket_ids ? formData.next_node_socket_ids.split(",") : [],
          input_value: {
            file_name: file.name, // File name from the input
            blob_name: blob_name,  // Blob name from the SAS URL response
          },
        },
      ],
    };

    try {
      const response = await fetch(
        `https://qa.govoyr.com/api/input_node/${workflowid}`, // Adjusted to the correct endpoint for INPUT nodes
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nodePayload),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Node created successfully:", data);
        setNodes((nds) => nds.concat(newNode));
        setNodeIdCounter((id) => id + 1);
        closeModal();
      } else {
        console.error("Failed to create node:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating input node:", error);
    }
  };

  const createNode = async () => {
    if (!selectedNodeType) {
        alert("Please select a node type.");
        return;
      }
  
      if (inputType === "file" && formData.file) {
        // Call createInputNode if input type is file
        await createInputNode(formData.file);
      } else {

    const workflowid = localStorage.getItem('selectedWorkflowId'); // Replace with the actual workflow ID
    const newNode = {
      id: `${nodeIdCounter}`,
      data: { label: selectedNodeType },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };

    const nodePayload = {
      INPUT: {
     
        node_name: formData.node_name || "Input Node",
        node_type: "INPUT",
        next_node_ids: formData.next_node_ids
          ? formData.next_node_ids.split(",")
          : [],
        input_data: [
          {
            is_structured: true,
            input_name: formData.input_name || "user_query",
            input_description:
              formData.input_description || "user query to respond to",
            is_static: false,
            next_node_socket_ids: formData.next_node_socket_ids
              ? formData.next_node_socket_ids.split(",")
              : [],
            input_value: formData.input_value || "",
          },
        ],
      },
      RAG: {
        node_name: formData.node_name || "RAG Node",
        node_type: "RAG",
        next_node_ids: formData.next_node_ids
          ? formData.next_node_ids.split(",")
          : [],
        system_prompt:
          formData.system_prompt ||
          "answer the user query based on the given context",
        llm_organization_name: formData.llm_organization_name || "Claude",
        llm_model_name: formData.llm_model_name || "claude-3-haiku-20240307",
        formatting_llm_organization: null,
        formatting_llm_model: null,
        input_socket_list: [
          {
            is_structured: true,
            input_name: formData.input_name || "context",
            input_description:
              formData.input_description || "context for answering user query",
            is_static: false,
            next_node_socket_ids: formData.next_node_socket_ids
              ? formData.next_node_socket_ids.split(",")
              : [],
            input_value: formData.input_value || "",
          },
        ],
        output_socket_list: [],
      },
      LLM: {
        node_name: formData.node_name || "LLM Node",
        node_type: "LLM",
        next_node_ids: formData.next_node_ids
          ? formData.next_node_ids.split(",")
          : [],
        system_prompt: formData.system_prompt || "hi",
        llm_organization_name: formData.llm_organization_name || "hi",
        llm_model_name: formData.llm_model_name || "hi",
        formatting_llm_organization: null,
        formatting_llm_model: null,
        input_socket_list: [
          {
            is_structured: false,
            input_name: formData.input_name || "user_input",
            input_description: formData.input_description || "user input",
            is_static: false,
            next_node_socket_ids: formData.next_node_socket_ids
              ? formData.next_node_socket_ids.split(",")
              : [],
            input_value: formData.input_value || "",
          },
        ],
        output_socket_list: [
          {
            is_structured: false,
            input_name: formData.output_name || "output_data",
            input_description: formData.output_description || "output data",
            is_static: false,
            next_node_socket_ids: [],
            input_value: "None",
          },
        ],
      },
    };

    try {
      const response = await fetch(
        `https://qa.govoyr.com/api/${selectedNodeType.toLowerCase()}_node/${workflowid}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nodePayload[selectedNodeType]),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Node created successfully:", data);
        setNodes((nds) => nds.concat(newNode));
        setNodeIdCounter((id) => id + 1);
        closeModal();
      } else {
        console.error("Failed to create node:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating node:", error);
    }
}
  };

  const renderFormFields = () => {
    switch (selectedNodeType) {
      case "INPUT":
        return (
          <>
            <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Node Name
            </label>
            <input
              name="node_name"
              onChange={handleInputChange}
              className="bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
            <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Input Name
            </label>
            <input
              name="input_name"
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
            <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Input Description
            </label>
            <input
              name="input_description"
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
            {/* Select Input Type */}
            <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Input Type
            </label>
            <select
              value={inputType}
              onChange={handleInputTypeChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            >
              <option value="string">String Input</option>
              <option value="file">File Input</option>
            </select>
            {/* Conditionally Render Textarea or File Input */}
            {inputType === "string" ? (
              <>
                <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  Input Value
                </label>
                <textarea
                  name="input_value"
                  onChange={handleInputChange}
                  rows="4"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Enter input value"
                />
              </>
            ) : (
              <>
                <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  Upload File
                </label>
                <input
          type="file"
          name="file"
          onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                  className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400"
                />
              </>
            )}
          </>
        );
      case "RAG":
        return (
          <>
            <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Node Name
            </label>
            <input
              name="node_name"
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
            <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
              System Prompt
            </label>
            <input
              name="system_prompt"
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
            <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
              LLM Organization Name
            </label>
            <input
              name="llm_organization_name"
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
            <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
              LLM Model Name
            </label>
            <input
              name="llm_model_name"
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
          </>
        );
      case "LLM":
        return (
          <>
            <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Node Name
            </label>
            <input
              name="node_name"
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
            <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
              System Prompt
            </label>
            <input
              name="system_prompt"
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
            <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
              LLM Organization Name
            </label>
            <input
              name="llm_organization_name"
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
            <label className="block mb-1 mt-2 text-sm font-medium text-gray-900 dark:text-white">
              LLM Model Name
            </label>
            <input
              name="llm_model_name"
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ height: "100vh", width: "100%" }} className="h-screen">
      <button
        onClick={openModal}
        className="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Create New Node
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="relative w-full max-w-2xl p-4 z-50">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 z-50">
              <div className="p text-start">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Create New Product
                  </h3>
                  <button
                    type="button"
                    onClick={closeModal} // Replace `closeModal` with your function to close the modal
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>

                <div className="p-4 md:p-5">
                  {/* Label for Select Node Type */}
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Select Node Type
                  </label>

                  {/* Dropdown Selection for Node Type */}
                  <select
                    value={selectedNodeType}
                    onChange={handleNodeTypeChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 z-50"
                  >
                    <option value="">Select</option>
                    <option value="INPUT">INPUT</option>
                    <option value="LLM">LLM</option>
                    <option value="RAG">RAG</option>
                  </select>

                  {/* Dynamically Rendered Form Fields */}
                  {renderFormFields()}

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={createNode}
                    className="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default WorkflowEditor;








