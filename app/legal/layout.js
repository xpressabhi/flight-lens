// app/legal/layout.js
import Link from 'next/link';

/**
 * Layout component for legal pages (Privacy Policy, Terms of Service).
 * Provides a consistent structure and navigation for these pages.
 * @param {object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The child components to be rendered within this layout.
 * @returns {JSX.Element} The layout structure for legal pages.
 */
export default function LegalLayout({ children }) {
  return (
    <div className='min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 font-inter text-gray-800'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl'>
        <header className='mb-8 text-center'>
          <Link href="/" className='text-purple-600 hover:text-purple-800 transition-colors duration-300'>
            <h1 className='text-3xl font-bold'>Flight Lens</h1>
          </Link>
        </header>
        <main>{children}</main>
        <footer className='mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500'>
          <p>&copy; {new Date().getFullYear()} Flight Lens. All rights reserved.</p>
          <div className='mt-2'>
            <Link href="/legal/privacy-policy" className='text-purple-600 hover:underline mx-2'>Privacy Policy</Link>
            <Link href="/legal/terms-of-service" className='text-purple-600 hover:underline mx-2'>Terms of Service</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}