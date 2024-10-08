import React, { useState } from 'react';

const NodeInput = ({ id }) => {
  const [userInterest, setUserInterest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      console.log('Process result:', result);
      alert('Input processed successfully!');
    } catch (error) {
      console.error('Error processing input:', error);
      alert(`There was an error processing your input: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-w-[400px] p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col gap-[20px]">
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
    </div>
  );
};

export default NodeInput;
