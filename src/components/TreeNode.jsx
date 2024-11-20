import React, { useState } from "react";

const TreeNode = ({ node, isRoot, isLastChild, onAdd, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(node.name);

  const handleSave = () => {
    if (node.name != newName) {
      onEdit(node.id, newName);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setNewName(node.name)
    }
  };

  const handleMouseDown = (e) => {
    if (e.button === 1 && !isRoot) {
      e.preventDefault();
      e.stopPropagation();
      onDelete(node.id);
    }
  };

  return (
    <div className={`tree-node ${isRoot ? "root" : ""}`} onMouseDown={handleMouseDown}>
      {!isRoot && <div className={`tree-line ${isLastChild ? "last" : ""}`}></div>}

      <div>
        {isEditing ? 
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
          />
         : 
          <span onDoubleClick={() => setIsEditing(true)}>{node.name}</span>
        }
        
        <button onClick={() => onAdd(node.id)}>Add Child</button>
      </div>

      {node.children.length > 0 && 
      <div>
        {node.children.map((child, index) => (
          <TreeNode
            key={child.id}
            node={child}
            isRoot={false}
            isLastChild={index === node.children.length - 1}
            onAdd={onAdd}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
      }
    </div>
  );
};

export default TreeNode;
