import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import Cookies from 'js-cookie';
import Header from '../components/Header';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const [orgId, setOrgId] = useState<string | null>(null);

  const handleOrgChange = (newOrgId: string) => {
    setOrgId(newOrgId);
    Cookies.set('orgId', newOrgId, { secure: true, sameSite: 'Strict', expires: 7 }); // Expires in 7 days
  };

  useEffect(() => {
    const token = Cookies.get('token');

    const publicRoutes = ['/login'];
    const path = router.pathname;

    const handleAuth = () => {
      if (!token && !publicRoutes.includes(path)) {
        router.push('/login');
      } else if (token && publicRoutes.includes(path)) {
        router.push('/dashboard');
      } else if (path === '/login' && token) {
        router.push('/dashboard');
      }
    };

    handleAuth();

    // Also save token in localStorage for easier access in some cases
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }

    // Set initial orgId from cookie
    const initialOrgId = Cookies.get('orgId');
    if (initialOrgId) {
      setOrgId(initialOrgId);
    }
  }, [router]);

  return (
    <>
      <Header selectedOrg={orgId} onOrgChange={handleOrgChange} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;