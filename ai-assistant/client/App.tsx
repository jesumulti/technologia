import React from 'react'; // Importing the React library
import { initWidget } from '../sdk/contextSdk'; // Importing the initWidget function from the contextSdk file
import AssistantWidget from './AssistantWidget'; // Importing the AssistantWidget component

const App: React.FC = () => {
  // State variables to store the API URL and tenant ID, initialized with values from localStorage or null
  const [apiUrl, setApiUrl] = React.useState<string | null>(localStorage.getItem('apiUrl'));
  const [tenantId, setTenantId] = React.useState<string | null>(localStorage.getItem('tenantId'));

  // useEffect hook to run initialization logic when the component mounts
  // or when apiUrl or tenantId changes
  React.useEffect(() => {
    // Retrieve API URL and tenant ID from localStorage when the component mounts
    const storedApiUrl = localStorage.getItem('apiUrl');
    const storedTenantId = localStorage.getItem('tenantId');

    // If the values are found in localStorage, set the state variables
    if (storedApiUrl) setApiUrl(storedApiUrl);
    if (storedTenantId) setTenantId(storedTenantId);
  }, []);
  React.useEffect(() => {
    // Initialize the widget with the stored API URL.
    initWidget(apiUrl || "");
  }, [apiUrl]);

  // Render the AssistantWidget only when apiUrl and tenantId are available
  if (apiUrl && tenantId) {
    return (
      <div>
        <AssistantWidget
          apiUrl={apiUrl} // Pass the API URL to the AssistantWidget
          tenantId={tenantId} // Pass the tenant ID to the AssistantWidget
        />
      </div>
    );
  }
  return <div>Loading...</div>; // Render a loading state while waiting for the values
};

export default App; // Export the App component as the default export