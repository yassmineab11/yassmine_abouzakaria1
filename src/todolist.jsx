import React, { useReducer, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const initialState = {
  todos: [],
};

function todoReducer(state, action) {
  switch (action.type) {
    case 'SET_TODOS':
      return { ...state, todos: action.payload };
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload] };
    case 'DELETE_TODO':
      return { ...state, todos: state.todos.filter(todo => todo.id !== action.payload) };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? { ...todo, title: action.payload.title } : todo
        ),
      };
    default:
      return state;
  }
}

export default function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        dispatch({ type: 'SET_TODOS', payload: data });
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, []);

  const handleAddTodo = () => {
    const newTask = {
      id: Date.now(),
      title: newTodo,
    };
    dispatch({ type: 'ADD_TODO', payload: newTask });
    setNewTodo('');
  };

  const handleDeleteTodo = (id) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  };

  const handleUpdateTodo = () => {
    dispatch({
      type: 'UPDATE_TODO',
      payload: { id: editingTodo.id, title: newTodo },
    });
    setEditingTodo(null);
    setNewTodo('');
  };

  const handleEditTodo = (todo) => {
    setNewTodo(todo.title);
    setEditingTodo(todo);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">What's the Plan for Today?</h1>
      
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Add a todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={editingTodo ? handleUpdateTodo : handleAddTodo}
        >
          {editingTodo ? 'Update Todo' : 'Add Todo'}
        </button>
      </div>

      <ul className="list-group">
        {state.todos.map((todo) => (
          <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{todo.title}</span>
            <div>
              <button className="btn btn-info btn-sm me-2" onClick={() => handleEditTodo(todo)}>
                Edit
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteTodo(todo.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
