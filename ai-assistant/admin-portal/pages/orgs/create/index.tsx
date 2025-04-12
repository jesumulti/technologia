import React, { useState } from 'react';
import { useRouter } from 'next/router';

const CreateOrganizationPage = () => {
  const [orgName, setOrgName] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
    fetch('/api/create-org', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: orgName }),
    })
      .then(async (response) => {
        if (response.ok) {
          // Successful submission
          console.log('Organization created successfully!');
          router.push('/dashboard');
        } else {
          // Handle error
          const errorData = await response.json();
          console.error('Error creating organization:', errorData.message);
          // You might want to display an error message to the user
        }
      })
      .catch((error) => console.error('Error:', error));
  };
  };

  return (
    <div>
      <h1>Create New Organization</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="orgName">Organization Name:</label>
          <input
            type="text"
            id="orgName"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Organization</button>
      </form>
    </div>
  );
};

export default CreateOrganizationPage;