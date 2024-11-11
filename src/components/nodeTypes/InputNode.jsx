import React from "react";
import { Handle, Position } from "reactflow";

const InputNode = ({ data }) => {
  const { inputData } = data; // Access inputData directly from data

  return (
    <div style={{ padding: "10px", borderRadius: "8px", background: "#2c2f36", color: "white", width: "200px", textAlign: "center" }}>
      <h4>{data.label}</h4> {/* Use the label passed in data */}
      <div style={{ fontSize: "12px", color: "#aaa" }}>Inputs</div>
      {inputData.map((input, index) => (
        <div key={index} style={{ margin: "5px 0", color: "#fff" }}>
          <div className="text-[7px]"><strong>Name:</strong> {input.input_name}</div>
          <div className="text-[7px]"><strong>Description:</strong> {input.input_description}</div>
        </div>
      ))}
      {/* Dynamically create source handles based on the number of inputData elements */}
      {inputData.map((_, index) => (
        <Handle
          key={index}
          type="source"
          position={Position.Right}
          id={`output-handle-${index}`} // Unique ID for each source handle
          style={{ top: `${20 + index * 30}px`, background: "#555" }} // Positioning handles vertically
        />
      ))}
    </div>
  );
};

export default InputNode;