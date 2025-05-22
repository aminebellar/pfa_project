import React from 'react';
import { Link } from 'react-router-dom';

export default function TailwindDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-center text-indigo-700 mb-8">Tailwind CSS Demo</h1>
        
        <div className="mb-6 text-center">
          <Link to="/" className="btn btn-outline">Back to Home</Link>
        </div>
        
        {/* Buttons Section */}
        <section className="card mb-8">
          <div className="card-header">
            <h2 className="text-xl font-bold">Button Styles</h2>
          </div>
          <div className="card-body">
            <div className="flex flex-wrap gap-4 mb-6">
              <button className="btn btn-primary">
                Primary Button
              </button>
              <button className="btn btn-secondary">
                Secondary Button
              </button>
              <button className="btn btn-outline">
                Outline Button
              </button>
              <button className="btn" style={{ backgroundColor: '#22c55e', color: 'white' }}>
                Direct Style
              </button>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <a href="#" className="btn btn-primary">Primary Link</a>
              <a href="#" className="btn btn-secondary">Secondary Link</a>
              <a href="#" className="btn btn-outline">Outline Link</a>
            </div>
          </div>
        </section>
        
        {/* Plain Text Example */}
        <section className="card mb-8">
          <div className="card-header">
            <h2 className="text-xl font-bold">Text Colors</h2>
          </div>
          <div className="card-body">
            <p className="text-indigo-600 mb-2">This text is indigo-600</p>
            <p className="text-blue-800 mb-2">This text is blue-800</p>
            <p className="text-gray-700 mb-2">This text is gray-700</p>
            <p className="text-white bg-indigo-600 p-2 rounded mb-2">This text is white on indigo-600</p>
            <p style={{ color: 'white', backgroundColor: '#4f46e5', padding: '8px', borderRadius: '8px' }}>
              Direct style: white on #4f46e5
            </p>
          </div>
        </section>
        
        {/* Form Elements */}
        <section className="card mb-8">
          <div className="card-header">
            <h2 className="text-xl font-bold">Form Elements</h2>
          </div>
          <div className="card-body">
            <form className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="input-field"
                  placeholder="you@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  className="input-field"
                  placeholder="Type your message here..."
                ></textarea>
              </div>
              
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <button type="button" className="btn btn-primary w-full">
                Submit Form
              </button>
            </form>
          </div>
        </section>
        
        {/* Alert Messages */}
        <section className="card mb-8">
          <div className="card-header">
            <h2 className="text-xl font-bold">Alert Messages</h2>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="alert alert-success">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Success message example</p>
                  </div>
                </div>
              </div>
              
              <div className="alert alert-error">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Error message example</p>
                  </div>
                </div>
              </div>
              
              <div className="alert alert-info">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Information message example</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Typography with @tailwindcss/typography */}
        <section className="card">
          <div className="card-header">
            <h2 className="text-xl font-bold">Typography Plugin Demo</h2>
          </div>
          <div className="card-body">
            <div className="prose max-w-none">
              <h2>Clean Typography with @tailwindcss/typography</h2>
              <p>
                This paragraph is styled using the typography plugin. It provides a clean, readable
                style for your content without having to manually style each element.
              </p>
              <blockquote>
                "Tailwind CSS is the only framework that I've seen scale on large teams."
                <cite>— Adam Wathan, Creator of Tailwind CSS</cite>
              </blockquote>
              <h3>List Example</h3>
              <ul>
                <li>First item with a <a href="#">link</a></li>
                <li>Second item with <strong>bold text</strong></li>
                <li>Third item with <em>emphasized text</em></li>
              </ul>
              <pre><code>// Some example code
const greeting = 'Hello, world!';
console.log(greeting);</code></pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 