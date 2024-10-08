import React, { useState, useEffect } from 'react';
import { useContentContext } from '../../ContentContest';

const NoteForm = ({ id, initialData, onSave }) => {
  const [formData, setFormData] = useState(initialData || {
    what: 'LLM',
    organization: '',
    model: '',
    how: '',
    using: '',
    name: '',
    to: '',
    where: ''
  });
  const { organizations, setOrganizations, models, setModels, nodeId } = useContentContext();
  const [selectedModels, setSelectedModels] = useState([]); // Models for the selected organization

  async function fetchOrganizationsAndModels() {
    try {
      const orgResponse = await fetch("https://qa.govoyr.com/api/organizations");
      const orgData = await orgResponse.json();

      const organizations = orgData.organization;
      setOrganizations(organizations);

      const modelResponse = await fetch("https://qa.govoyr.com/api/models");
      const modelData = await modelResponse.json();

      setModels(modelData);

      console.log("Organizations:", organizations);
      console.log("Models Data:", modelData);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchOrganizationsAndModels();
  }, []);

  useEffect(() => {
    setFormData(initialData || {
      what: 'LLM',
      organization: '',
      model: '',
      how: '',
      using: '',
      name: '',
      to: '',
      where:'',
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'organization') {
      setSelectedModels(models[value] || []);
    }
  };

  const handleSave = () => {
    onSave(formData); 
  };

  return (
    <div className="note-form-panel fixed top-0 right-0 w-72 h-full bg-black text-white p-4 overflow-auto">
      <h2 className="text-xl font-bold mb-4">Q&A bot - Editing Node {id}</h2>

      <label className="block mb-2">What</label>
      <input
        type="text"
        name="what"
        value={formData.what}
        onChange={handleChange}
        placeholder="LLM"
        className="w-full mb-4 p-2 bg-gray-800 text-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />

      {/* Organization Select */}
      <label className="block mb-2">Organization</label>
      <select
        name="organization"
        value={formData.organization}
        onChange={handleChange}
        className="w-full mb-4 p-2 bg-gray-800 text-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option value="">Select Organization</option>
        {organizations.map((org) => (
          <option key={org} value={org}>{org}</option>
        ))}
      </select>

      {/* Model Select */}
      <label className="block mb-2">Model</label>
      <select
        name="model"
        value={formData.model}
        onChange={handleChange}
        className="w-full mb-4 p-2 bg-gray-800 text-white  rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        disabled={!selectedModels.length}  // Disable if no models available
      >
        <option value="">Select Model</option>
        {selectedModels.map((model) => (
          <option key={model} value={model}>{model}</option>
        ))}
      </select>

      <label className="block mb-2">How</label>
      <div>
        <textarea
          id="chat"
          rows="3"
          name="how"
          value={formData.how}
          onChange={handleChange}
          className=" mb-4 block p-2 w-full text-sm text-text-white bg-gray-800 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Prompt"
        ></textarea>
      </div>

      {/* <label className="block mb-2">Using</label>
      <input
        type="text"
        name="using"
        value={formData.using}
        onChange={handleChange}
        placeholder="Product"
        className="w-full mb-4 p-2 bg-gray-800 text-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="string"
        className="w-full mb-4 p-2 bg-gray-800 text-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      /> */}

      <label className="block mb-2">To</label>
      <input
        type="text"
        name="to"
        value={formData.to}
        onChange={handleChange}
        placeholder="Curation"
        className="w-full mb-4 p-2 bg-gray-800 text-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />

<label className="block mb-2">Where</label>
      <input
        type="text"
        name="to"
        value={formData.where}
        onChange={handleChange}
        placeholder="Curation"
        className="w-full mb-4 p-2 bg-gray-800 text-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />

<div className="flex justify-end items-center">
        <button
          type="button"
          onClick={handleSave}
          className=" text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Save
        </button>
      </div>
    </div>
  );
};


export default NoteForm;