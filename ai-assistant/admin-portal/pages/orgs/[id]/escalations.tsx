import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

// Define the interface for an escalation item
interface EscalationItem {
  message: string;
  response: string;
  date: string;
}

// Define the component for the Escalations page
const OrgEscalationsPage: React.FC = () => {
  // State to hold the list of escalations
  const [escalations, setEscalations] = useState<EscalationItem[]>([]);
  // State to track loading status
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // State to track errors
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch escalations when the component mounts
    fetchEscalations();
  }, []);

  // Function to fetch escalations from the API
  const fetchEscalations = async () => {
    setIsLoading(true);
    setError(null); // Clear previous errors

    // Get the organization ID from the cookie
    const orgId = Cookies.get('orgId');

    if (!orgId) {
      setError('Organization ID not found.');
      setIsLoading(false);
      return;
    }

    try {
      // Make the API request to get escalations
      const response = await fetch('/api/get-escalations', {
        method: 'GET',
        headers: {
          'X-API-Key': orgId, // Include the API key in the headers
        },
      });

      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`Failed to fetch escalations: ${response.status}`);
      }

      // Parse the JSON response
      const data = await response.json();
      setEscalations(data);
    } catch (err: any) {
      // Handle errors and set the error state
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      // Set loading to false once the request is complete
      setIsLoading(false);
    }
  };

  // Render the component
  return (
    <div>
      <h1>Organization Escalations</h1>

      {isLoading && <p>Loading escalations...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display the list of escalations if available */}
      {!isLoading && !error && (
        <ul>
          {escalations.map((escalation, index) => (
            <li key={index}>
              <p><strong>Message:</strong> {escalation.message}</p>
              <p><strong>Response:</strong> {escalation.response}</p>
              <p><strong>Date:</strong> {new Date(escalation.date).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
        {/* Display a message if no escalations are available */}
      {!isLoading && !error && escalations.length === 0 && <p>No escalations found.</p>}
    </div>
  );
};

export default OrgEscalationsPage;