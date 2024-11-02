import React from 'react'

const NodeValuesForm = () => {
    const [selectedNodeType, setSelectedNodeType] = useState("");
    const [formData, setFormData] = useState({});
    const [inputType, setInputType] = useState("string");

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
  )
}

export default NodeValuesForm
