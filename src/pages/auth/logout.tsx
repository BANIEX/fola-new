import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export async function getServerSideProps({req, res}) {
  deleteCookie('auth.user', {req, res});
  return {
    redirect: '/auth/login',
    props: {}
  }
}
export default function Logout() {
  const router = useRouter();
  useEffect(() => {
    router.push('/auth/login');
  }, [])
  return (
    <>
    </>
  )
}