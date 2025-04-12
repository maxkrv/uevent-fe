import { Event, EventFormat } from '../modules/event/interfaces/event.interface';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Conference 2023',
    description:
      'Annual technology conference with industry leaders discussing the latest trends and innovations in AI, blockchain, and cloud computing. Network with professionals and attend workshops.',
    poster:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    startDate: '2023-09-15T09:00:00Z',
    endDate: '2023-09-17T18:00:00Z',
    location: {
      address: 'San Francisco, CA',
      latitude: 37.7749,
      longitude: -122.4194
    },
    price: 99.99,
    category: { id: '1', name: 'Business', description: 'Business related events' },
    format: EventFormat.CONFERENCE,
    company: {
      id: '1',
      name: 'TechCorp',
      logo: 'https://randomuser.me/api/portraits/men/1.jpg'
    }
  },
  {
    id: '2',
    title: 'Summer Music Festival',
    description:
      'Three days of amazing music performances from top artists across multiple genres. Food vendors, art installations, and camping available on site.',
    poster:
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    startDate: '2023-07-20T16:00:00Z',
    endDate: '2023-07-23T23:00:00Z',
    location: {
      address: 'Austin, TX',
      latitude: 30.2672,
      longitude: -97.7431
    },
    price: 149.99,
    category: { id: '2', name: 'Music', description: 'Music related events' },
    format: EventFormat.FESTIVAL,
    company: {
      id: '2',
      name: 'SoundWave Productions',
      logo: 'https://randomuser.me/api/portraits/women/2.jpg'
    }
  },
  {
    id: '3',
    title: 'Art Exhibition: Modern Masters',
    description:
      'Featuring works from contemporary artists exploring themes of identity, technology, and nature. Guided tours available daily.',
    poster:
      'https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    startDate: '2023-08-10T10:00:00Z',
    endDate: '2023-09-10T18:00:00Z',
    location: {
      address: 'New York, NY',
      latitude: 40.7128,
      longitude: -74.006
    },
    price: 25,
    category: { id: '3', name: 'Arts', description: 'Arts and culture events' },
    format: EventFormat.LECTURE,
    company: {
      id: '3',
      name: 'Metropolitan Gallery',
      logo: 'https://randomuser.me/api/portraits/women/3.jpg'
    }
  },
  {
    id: '4',
    title: 'Startup Pitch Night',
    description:
      'Entrepreneurs pitch their ideas to investors and receive feedback. Networking reception follows the presentations.',
    poster:
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    startDate: '2023-06-30T18:00:00Z',
    endDate: '2023-06-30T21:00:00Z',
    location: {
      address: 'Boston, MA',
      latitude: 42.3601,
      longitude: -71.0589
    },
    price: 0,
    category: { id: '1', name: 'Business', description: 'Business related events' },
    format: EventFormat.OTHER,
    company: {
      id: '4',
      name: 'Venture Accelerator',
      logo: 'https://randomuser.me/api/portraits/men/4.jpg'
    }
  },
  {
    id: '5',
    title: 'Food & Wine Festival',
    description:
      'Taste the best local and international cuisine paired with fine wines. Chef demonstrations and tasting workshops throughout the weekend.',
    poster:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    startDate: '2023-10-05T12:00:00Z',
    endDate: '2023-10-08T22:00:00Z',
    location: {
      address: 'Chicago, IL',
      latitude: 41.8781,
      longitude: -87.6298
    },
    price: 75,
    category: { id: '4', name: 'Food & Drink', description: 'Culinary events' },
    format: EventFormat.FESTIVAL,
    company: {
      id: '5',
      name: 'Gourmet Events',
      logo: 'https://randomuser.me/api/portraits/women/5.jpg'
    }
  },
  {
    id: '6',
    title: 'Charity Marathon',
    description:
      "Run for a cause and help raise funds for local children's hospitals. 5K, 10K, and half-marathon options available.",
    poster:
      'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80',
    startDate: '2023-09-24T07:00:00Z',
    endDate: '2023-09-24T13:00:00Z',
    location: {
      address: 'Seattle, WA',
      latitude: 47.6062,
      longitude: -122.3321
    },
    price: 35,
    category: { id: '5', name: 'Sports', description: 'Sports and fitness events' },
    format: EventFormat.WORKSHOP,
    company: {
      id: '6',
      name: 'HealthFirst Foundation',
      logo: 'https://randomuser.me/api/portraits/men/6.jpg'
    }
  },
  {
    id: '7',
    title: 'Photography Workshop',
    description:
      'Learn advanced techniques from professional photographers. Includes field trips and portfolio reviews.',
    poster:
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80',
    startDate: '2023-08-15T09:00:00Z',
    endDate: '2023-08-16T17:00:00Z',
    location: {
      address: 'Portland, OR',
      latitude: 45.5152,
      longitude: -122.6784
    },
    price: 120,
    category: { id: '3', name: 'Arts', description: 'Arts and culture events' },
    format: EventFormat.WORKSHOP,
    company: {
      id: '7',
      name: 'Creative Lens Studios',
      logo: 'https://randomuser.me/api/portraits/women/7.jpg'
    }
  },
  {
    id: '8',
    title: 'Blockchain Summit',
    description:
      'Industry experts discuss the future of blockchain technology and cryptocurrency. Networking opportunities with leading companies.',
    poster:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    startDate: '2023-11-10T08:00:00Z',
    endDate: '2023-11-11T18:00:00Z',
    location: {
      address: 'Miami, FL',
      latitude: 25.7617,
      longitude: -80.1918
    },
    price: 250,
    category: { id: '1', name: 'Business', description: 'Business related events' },
    format: EventFormat.CONFERENCE,
    company: {
      id: '8',
      name: 'Future Chain',
      logo: 'https://randomuser.me/api/portraits/men/8.jpg'
    }
  }
];
