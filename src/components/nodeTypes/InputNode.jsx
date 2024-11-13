import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

const InputNode = ({ data }) => {
  const { id, label, inputData } = data;

  return (
    <div style={{ padding: "10px", borderRadius: "8px", background: "#2c2f36", color: "white", width: "200px", textAlign: "center" }}>
      <h4>{label}</h4>
      <div style={{ fontSize: "12px", color: "#aaa" }}>Inputs</div>
      {inputData.map((_, index) => (
        <Handle
          key={index}
          type="source"
          position={Position.Right}
          id={`${id}-source-${index}`} // Ensure unique ID for each handle
          style={{ top: `${20 * index + 30}px`, background: "#555" }} 
        />
      ))}
    </div>
  );
};

export default InputNode;