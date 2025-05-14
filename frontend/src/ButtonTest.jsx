import React from 'react';
import { Link } from 'react-router-dom';

export default function ButtonTest() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-8">Button Text Color Test</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">1. Regular Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <button>Default Button</button>
            <button className="bg-indigo-600">Tailwind BG</button>
            <button className="bg-indigo-600 text-white">Tailwind BG + Text</button>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">2. Custom Classes</h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn">Base Button</button>
            <button className="btn btn-primary">Primary Button</button>
            <button className="btn btn-secondary">Secondary Button</button>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">3. Inline Styles</h2>
          <div className="flex flex-wrap gap-4">
            <button style={{ backgroundColor: '#4f46e5', color: 'white' }}>
              Inline Style
            </button>
            <button className="btn" style={{ backgroundColor: '#4f46e5', color: 'white' }}>
              Class + Inline
            </button>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">4. HTML Attributes</h2>
          <div className="flex flex-wrap gap-4">
            <button type="button" style={{ backgroundColor: '#4f46e5', color: 'white' }}>
              With type
            </button>
            <button onClick={() => alert('Clicked!')} style={{ backgroundColor: '#4f46e5', color: 'white' }}>
              With onClick
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-12">
        <Link to="/tailwind-demo" className="text-indigo-600 hover:underline">
          Back to Tailwind Demo
        </Link>
      </div>
    </div>
  );
} 