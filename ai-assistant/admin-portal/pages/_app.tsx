import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import Cookies from 'js-cookie';
import Header from '../components/Header';

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [orgId, setOrgId] = useState<string | null>(null);

  // Handler for organization change
  const handleOrgChange = (newOrgId: string) => {
    setOrgId(newOrgId);
    document.cookie = `orgId=${newOrgId}; path=/; Secure; SameSite=Strict; max-age=${7 * 24 * 60 * 60}`; // Expires in 7 days
  };

  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    // If no token and not on login page, redirect to login
    if (!token && router.pathname !== '/login') {
      router.push('/login');
    }
  }, [router]);

  return (
    <>
      {/* Render the header with selectedOrg and onOrgChange props if not on the login page */}
      {router.pathname !== '/login' && (
        <Header selectedOrg={orgId} onOrgChange={handleOrgChange} />
      )}
      <Component {...pageProps} />
    </>
  );
}

export default App;