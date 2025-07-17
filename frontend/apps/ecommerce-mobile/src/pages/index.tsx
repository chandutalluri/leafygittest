import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function MobileIndexPage() {
  const router = useRouter();

  // Redirect to home page to avoid duplication
  useEffect(() => {
    router.replace('/home');
  }, [router]);

  return (
    <>
      <Head>
        <title>LeafyHealth - Telugu Organic Groceries</title>
        <meta name="description" content="Fresh Telugu organic groceries delivered to your door" />
      </Head>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to home...</p>
        </div>
      </div>
    </>
  );
}
