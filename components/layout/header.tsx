"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userProfile');
    router.push('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center">
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Ai
            </span>
            <span className="text-3xl font-bold text-gray-900">CE</span>
            <Star className="h-4 w-4 text-blue-600 ml-1" />
            <div className="ml-2 px-2 py-0.5 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full border border-blue-600/20">
              <span className="text-xs font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                BETA
              </span>
            </div>
          </div>
        </Link>

        <div className="flex items-center space-x-4">
          <p className="text-base text-blue-600 hidden lg:block font-medium tracking-wide">
            Artificial Intelligence Continuing Education Credits
          </p>
          <div className="h-8 w-px bg-gray-200 mx-6 hidden lg:block" />
          <p className="text-sm text-gray-600 hidden lg:block font-medium">
            Smarter • Unbiased • Ever-Evolving
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* {isLoggedIn ? (
            <>
              <Button 
                variant="ghost" 
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 font-medium"
              >
                Dashboard
              </Button>
              <Button 
                onClick={handleLogout}
                variant="ghost"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 font-medium"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="lg"
                onClick={() => router.push('/auth/login')}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 font-medium"
              >
                Login
              </Button>
              <Button 
                size="lg"
                onClick={() => router.push('/auth/register')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 font-medium"
              >
                Register
              </Button>
            </>
          )} */}
        </div>
      </div>
    </header>
  );
}