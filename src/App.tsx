import React from 'react';
import KanbanBoard from './KanbanBoard';
const App: React.FC = () => {
  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Kanban Board</h1>
      <KanbanBoard />
    </div>
  );
};

export default App;
