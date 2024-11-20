import React, { useState, useEffect } from "react";
import TreeNode from "./TreeNode";
import '../styles/Navbar.css'
import '../styles/Tree.css'

const Tree = () => {
  const initialState = [{ id: 1, name: "Root", children: [] }];

  const [tree, setTree] = useState(initialState);
  const [isSaved, setIsSaved] = useState(true);

  const [savedMessage, setSavedMessage] = useState(false);
  const [loadedMessage, setLoadedMessage] = useState(false);
  const [loadErrorMessage, setLoadErrorMessage] = useState(false);
  const [resetMessage, setResetMessage] = useState(false);

  const addNode = (parentId) => {
    const newNode = { id: Date.now(), name: "New Node", children: [] };

    const updateTree = (nodes) => {
      return nodes.map((node) => {
        if (node.id === parentId) {
          return { ...node, children: [...node.children, newNode] };
        }
        return { ...node, children: updateTree(node.children) };
      });
    };

    setTree(updateTree(tree));
    setIsSaved(false);
  };

  const editNode = (id, newName) => {
    const updateTree = (nodes) => {
      return nodes.map((node) => {
        if (node.id === id) {
          return { ...node, name: newName };
        }
        return { ...node, children: updateTree(node.children) };
      });
    };

    setTree(updateTree(tree));
    setIsSaved(false);
  };

  const deleteNode = (id) => {
    const updateTree = (nodes) => {
      return nodes
        .filter((node) => node.id !== id)
        .map((node) => ({ ...node, children: updateTree(node.children) }));
    };

    setTree(updateTree(tree));
    setIsSaved(false);
  };

  const resetTree = () => {
    localStorage.removeItem("treeState")
    setTree(initialState);
    setIsSaved(false);
    setResetMessage(true)
    setTimeout(() => setResetMessage(false), 1000);
  };

  const saveState = () => {
    localStorage.setItem("treeState", JSON.stringify(tree));
    setIsSaved(true);
    setSavedMessage(true)
    setTimeout(() => setSavedMessage(false), 1000);
  };

  const loadState = () => {
    const savedState = localStorage.getItem("treeState");
    if (!savedState) {
      setLoadErrorMessage(true);
      setTimeout(() => setLoadErrorMessage(false), 1000); 
      return;
    }
    
    setTree(JSON.parse(savedState));
    setIsSaved(true);
    setLoadedMessage(true);
    setTimeout(() => setLoadedMessage(false), 1000); 
  };

  useEffect(() => {
    const savedState = localStorage.getItem("treeState");
    if (savedState) {
      setTree(JSON.parse(savedState));
    }
  }, []);

  return (
    <>
      <div className="navbar">
        <div>
          <button onClick={resetTree}>Reset</button>
          <button onClick={saveState}>Save</button>
          <button onClick={loadState}>Load</button>
          <span className={!isSaved ? "visible": ""}>Not saved</span>
        </div>
      </div>

      <div>
        {tree.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            isRoot={true}
            onAdd={addNode}
            onEdit={editNode}
            onDelete={deleteNode}
          />
        ))}
      </div>

      <div className={`toast ${savedMessage ? "visible": ""} saved`}> Saved </div>
      <div className={`toast ${loadedMessage ? "visible": ""} loaded`}> Loaded </div>
      <div className={`toast ${resetMessage ? "visible": ""} reset`}> Reset </div>
      <div className={`toast ${loadErrorMessage ? "visible": ""} loaded error`}> Not saved yet! </div>
    </>
  );
};

export default Tree;
