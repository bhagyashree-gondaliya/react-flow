// // import { useCallback } from 'react';
// // import ReactFlow, {
// //   MiniMap,
// //   Controls,
// //   Background,
// //   useNodesState,
// //   useEdgesState,
// //   addEdge,
// // } from 'reactflow';

// // import 'reactflow/dist/style.css';

// // const initialNodes = [
// //   { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
// //   { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
// // ];

// // const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

// // function App() {
// //   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
// //   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

// //   const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

// //   return (
// //     <div style={{ width: '1000px', height: '1000px' }}>
// //       <ReactFlow
// //         nodes={nodes}
// //         edges={edges}
// //         onNodesChange={onNodesChange}
// //         onEdgesChange={onEdgesChange}
// //         onConnect={onConnect}
// //       >
// //         <MiniMap />
// //         <Controls />
// //         <Background />
// //       </ReactFlow>
// //     </div>
// //   );
// // }

// // export default App;


// import React, { useCallback, useRef } from 'react';
// import ReactFlow, {
//   useNodesState,
//   useEdgesState,
//   addEdge,
//   useReactFlow,
//   ReactFlowProvider,
//   Background,
//   Controls
// } from 'reactflow';
// import 'reactflow/dist/style.css';

// import './index.css';

// const initialNodes = [
//   {
//     id: '0',
//     type: 'input',
//     data: { label: 'Node' },
//     position: { x: 0, y: 50 },
//   },
//   {
//     id: '1',
//     type: 'text',
//     data: { label: 'text' },
//     position: { x: 0, y: 120 },
//   },
// ];

// let id = 1;
// const getId = () => `${id++}`;

// const fitViewOptions = {
//   padding: 3,
// };

// const App = () => {
//   const reactFlowWrapper = useRef(null);
//   const connectingNodeId = useRef(null);
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const { project } = useReactFlow();
//   const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

//   const onConnectStart = useCallback((_, { nodeId }) => {
//     connectingNodeId.current = nodeId;
//   }, []);

//   const onConnectEnd = useCallback(
//     (event) => {
//       const targetIsPane = event.target.classList.contains('react-flow__pane');

//       if (targetIsPane) {
//         // we need to remove the wrapper bounds, in order to get the correct position
//         const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
//         const id = getId();
//         const newNode = {
//           id,
//           // we are removing the half of the node width (75) to center the new node
//           position: project({ x: event.clientX - left - 75, y: event.clientY - top }),
//           data: { label: `Node ${id}` },
//         };

//         setNodes((nds) => nds.concat(newNode));
//         setEdges((eds) => eds.concat({ id, source: connectingNodeId.current, target: id }));
//       }
//     },
//     [project]
//   );

//   return (
//     <div style={{ width: '1000px', height: '500px' }}>
//       <div className="wrapper" ref={reactFlowWrapper}>
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onConnect={onConnect}
//           onConnectStart={onConnectStart}
//           onConnectEnd={onConnectEnd}
//           fitView
//           fitViewOptions={fitViewOptions}
//         >
//           <Controls />
//           <Background />
//         </ReactFlow>
//       </div>
//     </div>
//   );
// };

// export default App;


import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from './Sidebar';

import './index.css';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'input node' },
    position: { x: 250, y: 5 },
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  return (
    <div style={{ width: '1000px', height: '500px' }}>
      <div className="dndflow">
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
            >
              <Controls />
              <Background />
            </ReactFlow>
          </div>
          <Sidebar />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default DnDFlow;
