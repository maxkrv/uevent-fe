import type React from 'react';
import { FiActivity, FiBookOpen, FiCoffee, FiMonitor, FiMusic, FiStar, FiUsers } from 'react-icons/fi';

const CATEGORIES = [
  {
    id: '1',
    name: 'Music',
    description: 'Live concerts, festivals, and performances',
    icon: <FiMusic className="text-purple-500" />,
    link: '/categories/music'
  },
  {
    id: '2',
    name: 'Food & Drink',
    description: 'Tastings, cooking classes, and food festivals',
    icon: <FiCoffee className="text-orange-500" />,
    link: '/categories/food-drink'
  },

  {
    id: '3',
    name: 'Arts',
    description: 'Exhibitions, performances, and workshops',
    icon: <FiBookOpen className="text-blue-500" />,
    link: '/categories/arts'
  },
  {
    id: '4',
    name: 'Business',
    description: 'Networking, conferences, and workshops',
    icon: <FiMonitor className="text-green-500" />,
    link: '/categories/business'
  },
  {
    id: '5',
    name: 'Community',
    description: 'Local gatherings and meetups',
    icon: <FiUsers className="text-red-500" />,
    link: '/categories/community'
  },
  {
    id: '6',
    name: 'Sports',
    description: 'Games, tournaments, and fitness events',
    icon: <FiActivity className="text-yellow-500" />,
    link: '/categories/sports'
  },
  {
    id: '7',
    name: 'Other',
    description: 'Unique and special events',
    icon: <FiStar className="text-indigo-500" />,
    link: '/categories/other'
  }
];

export const CategoriesSection: React.FC = () => {
  return (
    <section className="py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
        <p className="max-w-2xl mx-auto text-accent-foreground">
          Explore events by category to find exactly what you&apos;re looking for
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
        {CATEGORIES.map((category) => (
          <div key={category.id} className="flex flex-col items-center group cursor-pointer">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-accent mb-4  transition-all duration-300 transform group-hover:scale-110 group-hover:bg-primary-light">
              <div className="text-3xl">{category.icon || <FiStar className="text-primary" />}</div>
            </div>
            <h3 className="font-semibold  mb-1 group-hover:text-primary dark:group-hover:text-primary-light transition-colors duration-300">
              {category.name}
            </h3>
            <p className="text-xs text-muted-foreground text-center">{category.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
