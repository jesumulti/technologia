import React, { useState, useEffect } from 'react';

interface Org {
  name: string;
  id: string;
}

interface HeaderProps {
  selectedOrg: string | null;
  onOrgChange: (orgId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ selectedOrg, onOrgChange }) => {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    // Function to fetch the list of organizations from the API
    const fetchOrgs = async () => {
      setIsLoading(true); // Set loading state to true before fetching
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');
        const response = await fetch('/api/list-orgs', {
          headers: {
            'X-API-Key': token || '', // Include the token in the headers, or an empty string if no token
          },
        });
        if (response.ok) {
          const data: Org[] = await response.json();
          setOrgs(data); // Update the organizations state with the fetched data
        } else {
          console.error('Failed to fetch organizations'); // Log an error if the fetch fails
        }
      } catch (error) {
        console.error('Error fetching organizations:', error); // Log any errors during the fetch operation
      } finally {
        setIsLoading(false); // Set loading state to false after fetching (success or failure)
      }
    };

    fetchOrgs();
  }, []);

  // Handler for when the organization selection changes
  const handleOrgChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const orgId = event.target.value;
    document.cookie = `orgId=${orgId}; path=/; Secure; SameSite=Strict`; // Set the orgId cookie
    onOrgChange(orgId); // Call the parent component's callback with the new organization ID
  };

  return (
    <header className="bg-gray-100 p-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold">Admin Portal</h1>
      {isLoading ? (
        <span>Loading organizations...</span>
      ) : ( // Render the select dropdown if not loading
        <select className="border border-gray-300 rounded-md p-2" value={selectedOrg || ''} onChange={handleOrgChange}>
          <option value="">Select Organization</option>
          {orgs.map((org) => (
            <option key={org.id} value={org.id}>{org.name}</option>
          ))}
        </select>
      )}
    </header>
  );
};

export default Header;