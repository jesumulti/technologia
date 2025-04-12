import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrgs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/list-orgs');
        if (response.ok) {
          const data: Org[] = await response.json();
          setOrgs(data);
        } else {
          console.error('Failed to fetch organizations');
        }
      } catch (error) {
        console.error('Error fetching organizations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrgs();
  }, []);

  const handleOrgChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const orgId = event.target.value;
    Cookies.set('orgId', orgId, { secure: true, sameSite: 'strict' });
    onOrgChange(orgId);
  };

  return (
    <header className="bg-gray-100 p-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold">Admin Portal</h1>
        <span>Loading organizations...</span>
      ) : (
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
```

```typescript
// _app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Header from '../components/Header';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && router.pathname !== '/login') {
      router.push('/login');
    }
  }, [router]);

  return (
    <>
      {router.pathname !== '/login' && <Header />}
      <Component {...pageProps} />
    </>
  );
}