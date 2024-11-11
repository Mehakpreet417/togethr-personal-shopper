import React from "react";
import { Handle, Position } from "reactflow";

const LLMNode = ({ data }) => {
  console.log("data in llm", data)
  const { output_socket_list, input_socket_list } = data; // Accessing output and input socket lists

  return (
    <div style={{ padding: "10px", borderRadius: "8px", background: "#2c2f36", color: "white", width: "200px", textAlign: "center" }}>
      <h4>{data.label}</h4> {/* Use the label passed in data */}
      <div style={{ fontSize: "7px", color: "#aaa" }}>Outputs</div>
      {/* Dynamically create source handles based on the number of output_socket_list elements */}
      {output_socket_list?.map((output, index) => (
        <div key={index} style={{ margin: "5px 0", color: "#fff" }}>
          <div className="text-sm"><strong>Output:</strong> {output.output_name}</div>
          {/* Create a source handle for each output */}
          <Handle
            type="source"
            position={Position.Right}
            id={`output-handle-${index}`} // Unique ID for each source handle
            style={{ top: `${20 + index * 30}px`, background: "#555" }} // Positioning handles vertically
          />
        </div>
      ))}
      <div style={{ fontSize: "7px", color: "#aaa", marginTop: "10px" }}>Inputs</div>
      {/* Dynamically create target handles based on the number of input_socket_list elements */}
      {input_socket_list?.map((input, index) => (
        <div key={index} style={{ margin: "5px 0", color: "#fff" }}>
          <div><strong>Input:</strong> {input.input_name}</div>
          {/* Create a target handle for each input */}
          <Handle
            type="target"
            position={Position.Left}
            id={`input-handle-${index}`} // Unique ID for each target handle
            style={{ top: `${20 + index * 30}px`, background: "#555" }} // Positioning handles vertically
          />
        </div>
      ))}
    </div>
  );
};

export default LLMNode;