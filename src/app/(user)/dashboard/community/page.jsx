"use client"
import { useEffect, useState } from 'react';

const CommunityPage = () => {
  const [communities, setCommunities] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');


  // Fetch community data from the API
  useEffect(() => {
    fetch('/api/community/route')
      .then((res) => res.json())
      .then((data) => setCommunities(data.communities))
      .catch((error) => console.error('Error fetching communities:', error));
  }, []);

  // Handle form submission to create a new community
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/community/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });

      if (response.ok) {
        const newCommunity = await response.json();
        setCommunities((prevCommunities) => [...prevCommunities, newCommunity]);
        setName('');
        setDescription('');
      } else {
        console.error('Failed to add community');
      }
    } catch (error) {
      console.error('Error adding community:', error);
    }
  };

  return (
    <div>
      <h1>Community Page</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Community</button>
      </form>

      <h2>Existing Communities</h2>
      {communities.length > 0 ? (
        <ul>
          {communities.map((community) => (
            <li key={community._id}>
              <h3>{community.name}</h3>
              <p>{community.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No communities available.</p>
      )}
    </div>
  );
};

export default CommunityPage;