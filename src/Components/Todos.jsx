import axios from 'axios';
import React, { useEffect, useState } from 'react';

const urlTodos = 'https://jsonplaceholder.typicode.com/todos';

const ShowToDosComp = ({ userId, clickId, addingTodo, setAddingTodo, cancelAddTodos }) => {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    const getTodos = async () => {
      const { data } = await axios.get(`${urlTodos}?userId=${userId}`);
      const filterTodos = data.filter((todo) => todo.userId === userId);
      setTodos(filterTodos);
    };

    getTodos();
  }, [userId]);

  const handleMarkCompleted = async (todoId) => {
    try {
      const updatedTodos = todos.map((todo) => {
        if (todo.id === todoId) {
          return { ...todo, completed: true };
        }
        return todo;
      });

      await axios.put(`${urlTodos}/${todoId}`, { completed: true });

      setTodos(updatedTodos);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTodo = async () => {
    try {
      const response = await axios.post(urlTodos, {
        userId,
        title: newTodoTitle,
        completed: false,
      });

      setTodos([...todos, response.data]);
      setNewTodoTitle('');
      setAddingTodo(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ marginLeft: '100px', border: '1px solid black', padding: '10px', borderRadius: '10px' }}>
      Todos - User {userId}
      {clickId === userId && (
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '20px' }}>
          {addingTodo ? (
            <div>
            Title:   <input type="text" value={newTodoTitle} onChange={(e) => setNewTodoTitle(e.target.value)} />
              <button onClick={() => setAddingTodo(false)} style={{ marginTop: '10px', backgroundColor: 'lemonchiffon' }}>
                Cancel
              </button>
              <button onClick={handleAddTodo} style={{ marginTop: '10px', backgroundColor: 'lemonchiffon' }}>
                Add 
              </button>
             
            </div>
          ) : (
            <div>
              {todos.map((todo, index) => (
                <div key={index} style={{ border: '1px solid gray', marginBottom: '10px', padding: '10px', borderRadius: '10px' }}>
                  <div>Title: {todo.title}</div>
                  <div>Completed: {todo.completed ? 'true' : 'false'}</div>
                  {!todo.completed && (
                    <button onClick={() => handleMarkCompleted(todo.id)} style={{ marginTop: '10px', backgroundColor: 'lightgreen' }}>
                      Mark Completed
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowToDosComp;
