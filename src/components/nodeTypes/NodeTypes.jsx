import InputNode from "./InputNode";
import LLMNode from "./LLMNode";
import RAGNode from "./RAGNode"

// Export the object directly
const NodeTypes = {
  inputNode: InputNode,
  ragNode: RAGNode,
  llmNode: LLMNode,
};

export default NodeTypes;