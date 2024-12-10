import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css'; // Assuming you will move styles to a separate file

// Define types for the board
interface Task {
  id: string;
  content: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    tasks: [{ id: 'task-1', content: 'Task 1' }, { id: 'task-2', content: 'Task 2' }],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [],
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [],
  },
];

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);

  // Load the columns from localStorage
  useEffect(() => {
    const savedColumns = localStorage.getItem('kanban-columns');
    if (savedColumns) {
      const parsedColumns = JSON.parse(savedColumns);
      const updatedColumns = parsedColumns.map((column: Column) => ({
        ...column,
        tasks: column.tasks || [],
      }));
      setColumns(updatedColumns);
    }
  }, []);

  // Save columns to localStorage whenever they change
  useEffect(() => {
    if (columns) {
      localStorage.setItem('kanban-columns', JSON.stringify(columns));
    }
  }, [columns]);

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;

    // If dropped outside the board
    if (!destination) return;

    const sourceColumn = columns.find((column) => column.id === source.droppableId);
    const destColumn = columns.find((column) => column.id === destination.droppableId);
    if (!sourceColumn || !destColumn) return;  // Ensure columns are found

    //if (!sourceColumn || !destColumn) return;  // Ensure columns are found

    // If the task is dropped in the same column, no changes are needed
    if (sourceColumn === destColumn) {
      const reorderedTasks = Array.from(sourceColumn.tasks);
      const [removed] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, removed);

      const updatedColumns = columns.map((column) =>
        column.id === sourceColumn.id ? { ...column, tasks: reorderedTasks } : column
      );
      setColumns(updatedColumns);
    } else {
      // Moving task to another column
      const sourceTasks = Array.from(sourceColumn.tasks);
      const [removed] = sourceTasks.splice(source.index, 1);

      const destTasks = Array.from(destColumn.tasks);
      destTasks.splice(destination.index, 0, removed);

      const updatedColumns = columns.map((column) => {
        if (column.id === sourceColumn.id) {
          return { ...column, tasks: sourceTasks };
        }
        if (column.id === destColumn.id) {
          return { ...column, tasks: destTasks };
        }
        return column;
      });

      setColumns(updatedColumns);
    }
  };

  const addTask = (columnId: string) => {
    const newTask = prompt('Enter task content:');
    if (newTask) {
      const newTaskObj = {
        id: `task-${Date.now()}`,
        content: newTask,
      };

      setColumns(columns.map(column => 
        column.id === columnId
          ? { ...column, tasks: [...column.tasks, newTaskObj] }
          : column
      ));
    }
  };

  const deleteTask = (taskId: string, columnId: string) => {
    setColumns(columns.map(column => 
      column.id === columnId
        ? { ...column, tasks: column.tasks.filter(task => task.id !== taskId) }
        : column
    ));
  };

  return (
    <div className="kanban-board">
      <DragDropContext onDragEnd={handleDragEnd}>
        {columns.map((column) => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="kanban-column"
              >
                <div className="kanban-column-header">
                  <h2>{column.title}</h2>
                  <button onClick={() => addTask(column.id)}>+ Add Task</button>
                </div>
                {column.tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="kanban-task"
                      >
                        <span>{task.content}</span>
                        <button onClick={() => deleteTask(task.id, column.id)}>Delete</button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
