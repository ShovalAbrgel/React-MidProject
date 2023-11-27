import React, { useState } from 'react';
import axios from 'axios';

const urlUsers = 'https://jsonplaceholder.typicode.com/users';

const ShowAddUser = ({ setUsers, isUpdating, updateUser ,onCancel}) => {
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
  });

  const handleNameChange = (e) => {
    setNewUser((prevUser) => ({ ...prevUser, name: e.target.value }));
  };

  const handleEmailChange = (e) => {
    setNewUser((prevUser) => ({ ...prevUser, email: e.target.value }));
  };

  const handleAddUser = async () => {
    try {
      const resp = await axios.post(urlUsers, {
        name: newUser.name,
        email: newUser.email,
      });

      setUsers((prevUsers) => [...prevUsers, resp.data]);

      setNewUser({ name: '', email: '' });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (userId) => {
    try {
      const updatedUser = updateUser[userId];
      console.log('Update user:', updatedUser);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, ...updatedUser } : user
        )
      );

      console.log('Update successful');
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleCancel = () => {
    onCancel(); 
  };

  return (
    <div style={{width:'300px', marginBottom: '-300px', marginLeft: '850px',marginTop:'150px', border: '1px solid black', padding: '10px', borderRadius: '10px' }}>
      <h3>{isUpdating ? 'Update User' : 'Add new user'}</h3>
      Name: <input type='text' value={newUser.name} onChange={handleNameChange} />
      <br />
      Email: <input type='text' value={newUser.email} onChange={handleEmailChange} />

      <br/>
      {isUpdating && (
        <div style={{ overflowY: 'auto' }}>
          Street: <input type='text' value={newUser.address.street} onChange={(e) => setNewUser((prevUser) => ({ ...prevUser, address: { ...prevUser.address, street: e.target.value } }))} />
          <br />
          City: <input type='text' value={newUser.address.city} onChange={(e) => setNewUser((prevUser) => ({ ...prevUser, address: { ...prevUser.address, city: e.target.value } }))} />
          <br />
          Zip Code: <input type='text' value={newUser.address.zipcode} onChange={(e) => setNewUser((prevUser) => ({ ...prevUser, address: { ...prevUser.address, zipcode: e.target.value } }))} />
        </div>
      )}
      <br />
      
      <button style={{backgroundColor:'lemonchiffon',marginLeft:'120px' }} onClick={handleCancel}>Cancel</button> 
      <button style={{backgroundColor:'lemonchiffon'}} onClick={isUpdating ? () => handleUpdate(updateUser.id) : handleAddUser}>
        {isUpdating ? 'Update User' : 'Add '}
      </button>

    </div>
  );
};

export default ShowAddUser;
