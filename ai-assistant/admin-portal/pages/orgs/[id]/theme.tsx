import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface Theme {
  mainColor: string;
}

const defaultTheme: Theme = {
  mainColor: '#0070f3', // Default blue color
};

export default function OrgThemePage() {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchTheme = async () => {
      setLoading(true);
      const orgId = Cookies.get('orgId');
      if (!orgId) {
        console.error('No orgId found in cookie');
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('/api/get-theme', {
          method: 'GET',
          headers: {
            'X-API-Key': Cookies.get('token') || '',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTheme(data);
        } else {
          console.error('Failed to fetch theme');
          setErrorMessage('Failed to fetch theme');
        }
      } catch (error) {
        console.error('Error fetching theme:', error);
        setErrorMessage('Error fetching theme');
      } finally {
        setLoading(false);
      }
    };

    fetchTheme();
  }, []);

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTheme({ ...theme, mainColor: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);
    setLoading(true);

    try {
      const response = await fetch('/api/save-theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': Cookies.get('token') || '',
        },
        body: JSON.stringify(theme),
      });

      if (response.ok) {
        setSuccessMessage('Theme saved successfully!');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to save theme.');
      }
    } catch (error) {
      console.error('Error saving theme:', error);
      setErrorMessage('Error saving theme.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Organization Theme</h1>

      {loading && <p>Loading...</p>}

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="mainColor">Main Color:</label>
          <input
            type="color"
            id="mainColor"
            value={theme.mainColor}
            onChange={handleColorChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          Save Theme
        </button>
      </form>
    </div>
  );
}