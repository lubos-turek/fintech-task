'use client';

import SearchBar from './components/SearchBar';
import TreeView from './components/TreeView';

// Dummy ImageNet category data
const dummyCategories = [
  {
    id: '1',
    label: 'Animals',
    children: [
      {
        id: '1-1',
        label: 'Mammals',
        children: [
          { id: '1-1-1', label: 'Dog' },
          { id: '1-1-2', label: 'Cat' },
          { id: '1-1-3', label: 'Horse' },
          { id: '1-1-4', label: 'Elephant' },
        ],
      },
      {
        id: '1-2',
        label: 'Birds',
        children: [
          { id: '1-2-1', label: 'Eagle' },
          { id: '1-2-2', label: 'Parrot' },
          { id: '1-2-3', label: 'Penguin' },
        ],
      },
      {
        id: '1-3',
        label: 'Reptiles',
        children: [
          { id: '1-3-1', label: 'Snake' },
          { id: '1-3-2', label: 'Lizard' },
          { id: '1-3-3', label: 'Turtle' },
        ],
      },
    ],
  },
  {
    id: '2',
    label: 'Vehicles',
    children: [
      {
        id: '2-1',
        label: 'Cars',
        children: [
          { id: '2-1-1', label: 'Sedan' },
          { id: '2-1-2', label: 'SUV' },
          { id: '2-1-3', label: 'Sports Car' },
        ],
      },
      {
        id: '2-2',
        label: 'Aircraft',
        children: [
          { id: '2-2-1', label: 'Airplane' },
          { id: '2-2-2', label: 'Helicopter' },
        ],
      },
      {
        id: '2-3',
        label: 'Boats',
        children: [
          { id: '2-3-1', label: 'Sailboat' },
          { id: '2-3-2', label: 'Motorboat' },
        ],
      },
    ],
  },
  {
    id: '3',
    label: 'Food',
    children: [
      {
        id: '3-1',
        label: 'Fruits',
        children: [
          { id: '3-1-1', label: 'Apple' },
          { id: '3-1-2', label: 'Banana' },
          { id: '3-1-3', label: 'Orange' },
        ],
      },
      {
        id: '3-2',
        label: 'Vegetables',
        children: [
          { id: '3-2-1', label: 'Carrot' },
          { id: '3-2-2', label: 'Broccoli' },
          { id: '3-2-3', label: 'Tomato' },
        ],
      },
    ],
  },
  {
    id: '4',
    label: 'Objects',
    children: [
      {
        id: '4-1',
        label: 'Furniture',
        children: [
          { id: '4-1-1', label: 'Chair' },
          { id: '4-1-2', label: 'Table' },
          { id: '4-1-3', label: 'Sofa' },
        ],
      },
      {
        id: '4-2',
        label: 'Electronics',
        children: [
          { id: '4-2-1', label: 'Laptop' },
          { id: '4-2-2', label: 'Phone' },
          { id: '4-2-3', label: 'Monitor' },
        ],
      },
    ],
  },
];

export default function Home() {
  const handleSearch = (query: string) => {
    // This will be called after 1 second of debounce
    // Currently just logs to console as requested
  };

  const handleEnter = (query: string) => {
    // This will be called when Enter is pressed
    // Currently just logs to console as requested
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            ImageNet Categories Explorer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Browse and search through ImageNet category hierarchy
          </p>
        </header>

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <SearchBar 
            onSearch={handleSearch}
            onEnter={handleEnter}
            placeholder="Search ImageNet categories..."
          />
        </div>

        {/* Tree View */}
        <div className="flex justify-center">
          <TreeView data={dummyCategories} />
        </div>
      </div>
    </main>
  );
}

