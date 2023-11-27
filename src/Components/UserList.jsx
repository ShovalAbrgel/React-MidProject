import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ShowToDosComp from './Todos';
import ShowPostsComp from './Posts';
import ShowAddUser from './AddUser';

const urlUsers = 'https://jsonplaceholder.typicode.com/users';
const urlTodos = 'https://jsonplaceholder.typicode.com/todos';
const urlPosts = 'https://jsonplaceholder.typicode.com/posts';


const UserListComp = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [userData, setUserData] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedUserData, setUpdatedUserData] = useState({});
  const [clickId, isClickId] = useState(null);
  const [addingTodo, setAddingTodo] = useState(false);
  const [addingPost, setAddingPost] = useState(false);
  const [isClickAdd, setIsClickAdd] = useState(false);




  const handleChange = (e) => {
    setSearchInput(e.target.value);
    setSelectedUserId(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get(urlUsers);
        const tasksResponse = await axios.get(urlTodos);

        const users = usersResponse.data;
        const filteredResults = users.filter(
          (user) =>
            user.name.toLowerCase().includes(searchInput.toLowerCase()) ||
            user.email.toLowerCase().includes(searchInput.toLowerCase())
        );

        setUserData(users);
        setTasks(tasksResponse.data);
        setSearchResults(filteredResults);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [searchInput]);

  const hasUncompletedTasks = (userId) => {
    const userTasks = tasks.filter((task) => task.userId === userId);
    const uncompletedTasks = userTasks.filter((task) => !task.completed);
    return uncompletedTasks.length > 0;
  };
  

  const showOtherData = (userId) => {
    setSelectedUserId((prevUserId) => (prevUserId === userId ? null : userId));
  };

  const closeOtherDataClick = () => {
    setSelectedUserId(null);
  };


  const handelDelete = async (userId) => {
    try {
      await axios.delete(`${urlUsers}/${userId}`);
      setSearchResults((prevResults) => prevResults.filter((user) => user.id !== userId));
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (userId) => {
    try {
      const updatedUser = updatedUserData[userId];
      console.log('Update user:', updatedUser);
  
      setSearchResults((prevResults) =>
        prevResults.map((user) =>
          user.id === userId ? { ...user, ...updatedUser } : user
        )
      );
  
      console.log('Update successful');
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };
  


  const handleAddOptionClick = () => {
    setAddingTodo(!addingTodo);
    setAddingPost(!addingPost);
    setIsClickAdd(!clickId);
    setSelectedUserId(null);
  };



  const cancelAddPosts = () => {
    setAddingPost(false);
    setIsClickAdd(false)
  };

  const cancelAddTodos = () => {
    setAddingTodo(false);
  };

  const setUsers = (newUsers) => {
    setUserData(newUsers);
    setSearchResults(newUsers);
  };

  const handleCancelAddUser = () => {
    setIsClickAdd(false);
  };


  return (
    <div
      style={{
        border: '1px solid gray',
        width: '450px',
        height: '4000px',
        marginBottom: '10px',
        padding: '10px',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      Search{' '}
      <input style={{marginRight:'30px'}} type="text" value={searchInput} onChange={handleChange} />

      
      <button style={{ marginLeft: '324px', marginTop: '-22px',backgroundColor:'lemonchiffon' }} onClick={handleAddOptionClick}>
        {isClickAdd ? 'Cancel' : 'Add'}
        </button>

{isClickAdd && selectedUserId === null && (
  <ShowAddUser setUsers={setUsers} isUpdating={false} onCancel={handleCancelAddUser} />
)}


      {searchResults.map((user) => (
        <div
          key={user.id}
          style={{
            width: '100%',
            height: '500px',
            padding: '10px',
            borderRadius: '10px',
            border: hasUncompletedTasks(user.id) ? '1px solid red' : '1px solid green',
            marginBottom: '5px',
            backgroundColor: clickId === user.id ? '#FFC55C' : 'transparent',
          }}
        >
          ID:
          <button onClick={() => isClickId((prevId) => (prevId === user.id ? null : user.id))} style={{ border: 'none', cursor: 'pointer' }}>
            {user.id}
          </button>
          <br />
          <br />
          Name: <input type="text" placeholder="name" value={updatedUserData[user.id]?.name || user.name} onChange={(e) => setUpdatedUserData((prev) => ({ ...prev, [user.id]: { ...prev[user.id], name: e.target.value } }))} />
          <br />
          <br />
          Email: <input type="email" placeholder="Email" value={updatedUserData[user.id]?.email || user.email} onChange={(e) => setUpdatedUserData((prev) => ({ ...prev, [user.id]: { ...prev[user.id], email: e.target.value } }))} />

          <br />
          <br />

          <div style={{ marginTop: '10px', display: 'flex', gap: '20px' }}>
            <button
              onMouseOver={() => showOtherData(user.id)}
              onClick={closeOtherDataClick}
              style={{ backgroundColor: 'gray' }}
            >
              Other Data
            </button>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
              <button onClick={() => handleUpdate(user.id, { name: updatedName, email: updatedEmail })} style={{ backgroundColor: 'lemonchiffon' }}>Update</button>
              <button onClick={() => handelDelete(user.id)} style={{ backgroundColor: 'lemonchiffon' }}>Delete</button>
            </div>
          </div>
          <br />
          {selectedUserId === user.id && (
            <div style={{ position: 'absolute', border: "1px solid black", backgroundColor: "lightgrey", marginBottom: '10px', color: "black", padding: '10px', borderRadius: "10px" }}>
              <br />
              Street: <input type='text' value={updatedUserData[user.id]?.address?.street || (user.address ? user.address.street : '')} onChange={(e) => setUpdatedUserData((prev) => ({ ...prev, [user.id]: { ...prev[user.id], address: { ...prev[user.id]?.address, street: e.target.value } } }))} />
              <br />
              City: <input type='text' value={updatedUserData[user.id]?.address?.city || (user.address ? user.address.city : '')} onChange={(e) => setUpdatedUserData((prev) => ({ ...prev, [user.id]: { ...prev[user.id], address: { ...prev[user.id]?.address, city: e.target.value } } }))} />
              <br />
              Zip Code: <input type='text' value={updatedUserData[user.id]?.address?.zipcode || (user.address ? user.address.zipcode : '')} onChange={(e) => setUpdatedUserData((prev) => ({ ...prev, [user.id]: { ...prev[user.id], address: { ...prev[user.id]?.address, zipcode: e.target.value } } }))} />
            </div>
          )}
          <div style={{ width: '90%', height: 'auto', marginLeft: '400px', marginTop: '-232px' }}>
            {clickId === user.id && (
              <>
                <ShowToDosComp userId={user.id} clickId={clickId} addingTodo={addingTodo} setAddingTodo={setAddingTodo} cancelAddTodos={cancelAddTodos} />
                <br />
                <br />
                <ShowPostsComp userId={user.id} clickId={clickId} addingPost={addingPost} setAddingPost={setAddingPost} cancelAddPosts={cancelAddPosts} />
              </>
            )}
          </div >
        </div>

      ))}

    </div>
  );
};

export default UserListComp;
