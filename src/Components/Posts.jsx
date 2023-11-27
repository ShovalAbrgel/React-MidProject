import axios from 'axios';
import React, { useEffect, useState } from 'react';

const urlPosts = 'https://jsonplaceholder.typicode.com/posts';

const ShowPostsComp = ({ userId, clickId, addingPost, setAddingPost }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [newBody , setNewBody] = useState('');

  useEffect(() => {
    const getPosts = async () => {
      const { data } = await axios.get(`${urlPosts}?userId=${userId}`);
      const filterPosts = data.filter((post) => post.userId === userId);
      setPosts(filterPosts);
    };

    getPosts();
  }, [userId]);


  const handleAddPost = async () => {
    try {
      const resp = await axios.post(urlPosts, {
        userId,
        title: newPost, 
        body:newBody,
      });

      setPosts([...posts, resp.data]);
      setNewPost('');
      setNewBody('');
      setAddingPost(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ marginLeft: '100px', border: '1px solid black', padding: '10px', borderRadius: '10px' }}>
      Posts - User {userId}
      {clickId === userId && (
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '20px' }}>
          {addingPost ? (
            <div>
              Title : <input type="text" value={newPost} onChange={(e) => setNewPost(e.target.value)} />
              Body : <input type="text" value={newBody} onChange={(e) => setNewBody(e.target.value)} />
              <button onClick={() => setAddingPost(false)} style={{ marginTop: '10px', backgroundColor: 'lemonchiffon' }}>
                Cancel
              </button>
              <button onClick={handleAddPost} style={{ marginTop: '10px', backgroundColor: 'lemonchiffon' }}>
                Add 
              </button>
           
            </div>
          ) : (
            <div>
              {posts.map((post, index) => (
                <div key={index} style={{ border: '1px solid gray', marginBottom: '10px', padding: '10px', borderRadius: '10px' }}>
                  <div><strong>Title:</strong> {post.title}</div>
                  <div><strong>body:</strong>{post.body}</div>               
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowPostsComp;
