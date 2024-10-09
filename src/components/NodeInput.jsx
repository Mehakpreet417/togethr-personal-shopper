import React, { useState } from 'react';

const NodeInput = ({ id, onClose }) => {
  const [userInterest, setUserInterest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResult, setApiResult] = useState(null); 
  const [isJsonFormat, setIsJsonFormat] = useState(true); 

  const handleInputChange = (e) => {
    setUserInterest(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInterest) {
      alert('Please enter your interest.');
      return;
    }

    setIsSubmitting(true);

    // Define the postData using the id from props directly
    const postData = {
      node_object_id: "b6a2d577-1d0f-4cbe-b9bc-9f50913317d2",  // Use the id from props directly
      input_data: {
        search_queries: {
          type: "list<str>",
          description: "user's search queries",
          value: Array.isArray(userInterest) ? userInterest.map(String) : [String(userInterest)],  // Ensure it's an array of strings
        },
      },
    };

    try {
      const response = await fetch('https://qa.govoyr.com/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Capture error details
        console.error('API error response:', errorData);
        throw new Error(errorData.message || 'Failed to process input');
      }

      const result = await response.json();
      alert('Input processed successfully!');
      setApiResult(result.response);
    } catch (error) {
      alert(`There was an error processing your input: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFormat = () => {
    setIsJsonFormat(!isJsonFormat);  // Toggle between formats
  };

  return (
    <div className="min-w-[400px] p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col gap-[20px] relative"> {/* Added relative positioning */}
      <button
        onClick={onClose} // Call onClose function when clicked
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        aria-label="Close"
      >
        &times; {/* Cross character */}
      </button>

      <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Process Input</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
        <div>
          <textarea
            id="chat"
            rows="3"
            value={userInterest} // Set the value from userInterest
            onChange={handleInputChange}
            className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your interest, e.g., 'best mobile phone under 30k INR'"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="py-2.5 px-4 bg-blue-500 text-white rounded-lg focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:focus:ring-blue-800"
        >
          {isSubmitting ? 'Processing...' : 'Submit'}
        </button>
      </form>
{/* 
      {apiResult && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg dark:bg-gray-700">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white">API Response:</h4>
          <pre className="text-sm text-gray-800 dark:text-gray-200">
            {JSON.stringify(apiResult, null, 2)}
          </pre>
        </div>
      )} */}

{apiResult && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg dark:bg-gray-700 relative">
          <button
            onClick={handleToggleFormat}
            className="absolute top-2 right-2 text-gray-300 hover:text-gray-500"
            aria-label="Toggle Format"
          >
            {isJsonFormat ? 'Detailed View' : 'JSON View'}
          </button>

          <h4 className="text-md font-semibold text-gray-900 dark:text-gray-300">API Response:</h4>

          {isJsonFormat ? (
            <pre className="text-sm mt-[15px] text-gray-800 dark:text-gray-300 max-w-[350px] overflow-x-auto overflow-y-hidden">
              {JSON.stringify(apiResult, null, 2)}
            </pre>
          ) : (
            <div className="text-sm mt-[15px] flex flex-col gap-[5px] text-gray-900 dark:text-gray-300 max-w-[350px] overflow-x-auto overflow-y-hidden">
              {/* Render individual properties of the object */}
              {apiResult.product_type && (
                <>
                  <p><strong>Product Type - </strong></p>
                  <p>{'   '}<strong>Type: </strong> {apiResult.product_type.type}</p>
                  <p>{'   '}<strong>Description: </strong> {apiResult.product_type.description}</p>
                  <p>{'   '}<strong>Value: </strong> {apiResult.product_type.value}</p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NodeInput;
