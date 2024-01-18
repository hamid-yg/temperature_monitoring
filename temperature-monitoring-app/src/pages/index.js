import React, { useState } from 'react';
import { Inter } from 'next/font/google'
import Link from "next/link";
import { useRouter } from 'next/router';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'] })

export default function Login() {
  var router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const validateEmail = (email) => {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleCreateAccount = (e) => {
    e.preventDefault(); // Prevent default form submission

    // Reset previous error states
    setPasswordsMatch(true);
    setPasswordError(false);

    if (!validateEmail(email)) {
      setEmailError(true);
      return;
    }

    // Password regex check (for example, requiring at least 8 characters)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!passwordRegex.test(password)) {
      setPasswordError(true);
      return;
    }

    // Check if passwords match
    if (password === confirmPassword) {
      // Passwords match, proceed with account creation logic
      // ...
      router.push('/homePage')
      // For example, show an alert for successful account creation
      alert('Account created successfully!');
    } else {
      // Passwords do not match, update state to show an error message
      setPasswordsMatch(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 bg-white rounded-md shadow-md lg:max-w-xl">
        <div className="text-3xl font-bold text-center text-gray-700 flex flex-row justify-around">
        <p>Temperature monitoring</p>
          <Image 
            src="/temperature icon.png" // Path to your image inside the public directory
            alt="icon"
            width={50}
            height={50}
          />
        </div>
        {showForm ? (
          <>
            <form className="mt-6" onSubmit={handleCreateAccount}>
            <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-800"
                >
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40 ${
                    emailError ? 'border-red-500' : ''
                  }`}
                />
                {emailError && (
                  <p className="text-red-500 text-xs mt-1">
                    Please enter a valid email address.
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-800"
                >
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40 ${
                    !passwordsMatch || passwordError ? 'border-red-500' : ''
                  }`}
                />
                {!passwordsMatch && (
                  <p className="text-red-500 text-xs mt-1">
                    Passwords do not match.
                  </p>
                )}
                {passwordError && (
                  <p className="text-red-500 text-xs mt-1">
                    Password must be at least 8 characters and contain at least one letter and one number.
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-800"
                >
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40 ${
                    !passwordsMatch ? 'border-red-500' : ''
                  }`}
                />
                {!passwordsMatch && (
                  <p className="text-red-500 text-xs mt-1">
                    Passwords do not match.
                  </p>
                )}
              </div>
              <div className="mt-2">
                <button
                  type="submit" // Specify button type to submit the form
                  className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
                >
                  Create your account
                </button>
              </div>
            </form >

            <p className="mt-4 text-sm text-center text-gray-700">
              Already have an account?{" "}
              <button
                className="font-medium text-blue-600 hover:underline"
                onClick={() => setShowForm(false)}
              >
                Sign up
              </button>
            </p>
          </>
        ) : (
          <>
            <form className="mt-6">
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-800"
                >
                  Email
                </label>
                <input
                  type="email"
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-800"
                >
                  Password
                </label>
                <input
                  type="password"
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>
              <Link
                href="/forget"
                className="text-xs text-blue-600 hover:underline"
              >
                Forget Password?
              </Link>
              <div className="mt-2">
                <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">
                  Login
                </button>
              </div>
            </form >

            <p className="mt-4 text-sm text-center text-gray-700">
              Don't have an account?{" "}
              <button
                className="font-medium text-blue-600 hover:underline"
                onClick={() => setShowForm(true)}
              >
                Create an account
              </button>
            </p>
          </>
        )}
      </div >
    </div >
  )
}
