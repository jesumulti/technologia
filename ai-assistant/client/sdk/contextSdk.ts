let recentApiErrors: string[] = [];

export interface Context {
  currentPage: string;
  userRole: string;
  permissions: string[];
  recentApiErrors: string[];
}

/**
 * Retrieves the application context, including user role, permissions,
 * and any recent API errors.
 *
 * @returns {Promise<Context>} A promise that resolves with the context object.
 */
export async function getContext(): Promise<Context> {
  try {
    // Make a POST request to the /chat endpoint to retrieve the context.
    // Send an empty object as the body.
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include the API key from localStorage in the request headers.
        // If no key is found, send an empty string.
        'x-api-key': localStorage.getItem('apiKey') || '',
      },
      // Send an empty object as the body of the POST request.
      // The backend should handle this as a request for initial context.
      body: JSON.stringify({}),
    });

    // If the request was successful, parse the JSON response and return it.
    if (response.ok) {
      return await response.json();
    } else {
      // If the request failed, add an error message to the recentApiErrors array.
      recentApiErrors.push(`API Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error: any) {
    // If an error occurred during the fetch operation, add an error message
    // to the recentApiErrors array.
    recentApiErrors.push(`Fetch Error: ${error.message}`);
  }

  // Return a default context object with the current page and any recent errors.
  return { currentPage: window.location.pathname, userRole: 'unknown', permissions: [], recentApiErrors };
}

export function initWidget(apiUrl: string): void {
  console.log(apiUrl);
}