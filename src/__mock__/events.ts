import { type Event, EventFormat } from '../modules/event/interfaces/event.interface';
import { mockUsers } from './users';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Conference 2023',
    description:
      'Annual technology conference with industry leaders discussing the latest trends and innovations in AI, blockchain, and cloud computing. Network with professionals and attend workshops.',
    poster:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    startDate: '2025-09-15T09:00:00Z',
    endDate: '2025-09-17T18:00:00Z',
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
    },
    maxAttendees: 500,
    currentAttendees: 320,
    showAttendees: 'ALL',
    attendees: mockUsers,
    notifyOrganizer: true
  },
  {
    id: '2',
    title: 'Summer Music Festival',
    description:
      'Three days of amazing music performances from top artists across multiple genres. Food vendors, art installations, and camping available on site.',
    poster:
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    startDate: '2025-07-20T16:00:00Z',
    endDate: '2025-07-23T23:00:00Z',
    location: {
      address: 'Austin, TX',
      latitude: 30.2672,
      longitude: -97.7431
    },
    price: 149.99,
    category: { id: '2', name: 'Music', description: 'Music related events' },
    format: EventFormat.FESTIVAL,
    maxAttendees: 50,
    currentAttendees: 50, // Sold out
    attendees: mockUsers,
    company: {
      id: '2',
      name: 'SoundWave Productions',
      logo: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    showAttendees: 'ATTENDEES_ONLY',
    notifyOrganizer: true
  },
  {
    id: '3',
    title: 'Art Exhibition: Modern Masters',
    description:
      'Featuring works from contemporary artists exploring themes of identity, technology, and nature. Guided tours available daily.',
    poster:
      'https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    startDate: '2023-08-10T10:00:00Z', // Past event
    endDate: '2023-09-10T18:00:00Z',
    attendees: mockUsers,
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
    },
    maxAttendees: 200,
    currentAttendees: 175,
    showAttendees: 'ALL'
  },
  {
    id: '4',
    title: 'Startup Pitch Night',
    description:
      'Entrepreneurs pitch their ideas to investors and receive feedback. Networking reception follows the presentations.',
    poster:
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    startDate: '2023-06-30T18:00:00Z', // Past event
    endDate: '2023-06-30T21:00:00Z',
    attendees: mockUsers,
    location: {
      address: 'Boston, MA',
      latitude: 42.3601,
      longitude: -71.0589
    },
    price: 0, // Free event
    category: { id: '1', name: 'Business', description: 'Business related events' },
    format: EventFormat.OTHER,
    company: {
      id: '4',
      name: 'Venture Accelerator',
      logo: 'https://randomuser.me/api/portraits/men/4.jpg'
    },
    maxAttendees: 100,
    currentAttendees: 87,
    notifyOrganizer: false
  },
  {
    id: '5',
    title: 'Food & Wine Festival',
    attendees: mockUsers,
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
    },
    maxAttendees: 300,
    currentAttendees: 298, // Almost sold out
    showAttendees: 'ATTENDEES_ONLY'
  },
  {
    id: '6',
    title: 'Charity Marathon',
    attendees: mockUsers,
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
    },
    maxAttendees: 1000, // Large capacity
    currentAttendees: 412,
    notifyOrganizer: true
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
    attendees: mockUsers,
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
    },
    maxAttendees: 25, // Small workshop
    currentAttendees: 24, // Almost full
    showAttendees: 'ALL'
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
    },
    maxAttendees: 400,
    currentAttendees: 267,
    redirectUrl: 'https://blockchain-summit.example.com', // External URL
    notifyOrganizer: true
  },
  {
    id: '9',
    title: 'Virtual Reality Expo',
    description:
      'Experience the latest in VR technology with demos from leading manufacturers. Panel discussions on the future of immersive media.',
    poster:
      'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    startDate: '2025-03-15T10:00:00Z',
    endDate: '2025-03-17T18:00:00Z',
    location: {
      address: 'Los Angeles, CA',
      latitude: 34.0522,
      longitude: -118.2437
    },
    price: 85,
    category: { id: '6', name: 'Technology', description: 'Technology and innovation events' },
    format: EventFormat.CONFERENCE,
    company: {
      id: '9',
      name: 'Future Immersive',
      logo: 'https://randomuser.me/api/portraits/men/9.jpg'
    },
    maxAttendees: 350,
    currentAttendees: 0, // No attendees yet
    publishDate: '2024-12-01T00:00:00Z', // Future publish date
    showAttendees: 'ALL'
  },
  {
    id: '10',
    title: 'Yoga Retreat Weekend',
    description:
      'Escape the city for a weekend of yoga, meditation, and wellness workshops in a peaceful natural setting.',
    poster:
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    startDate: '2025-06-05T15:00:00Z',
    endDate: '2025-06-07T12:00:00Z',
    location: {
      address: 'Sedona, AZ',
      latitude: 34.8697,
      longitude: -111.761
    },
    price: 350,
    category: { id: '7', name: 'Health & Wellness', description: 'Health and wellness events' },
    format: EventFormat.WORKSHOP,
    company: {
      id: '10',
      name: 'Mindful Living',
      logo: 'https://randomuser.me/api/portraits/women/10.jpg'
    },
    maxAttendees: 30,
    currentAttendees: 12,
    notifyOrganizer: true,
    attendees: mockUsers.slice(0, 12)
  },
  {
    id: '11',
    title: 'Indie Film Festival',
    description:
      'Showcasing independent films from around the world. Q&A sessions with directors and actors after screenings.',
    poster:
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    startDate: '2025-04-20T11:00:00Z',
    endDate: '2025-04-25T23:00:00Z',
    location: {
      address: 'Park City, UT',
      latitude: 40.6461,
      longitude: -111.498
    },
    price: 120,
    attendees: mockUsers,
    category: { id: '8', name: 'Film & Media', description: 'Film and media events' },
    format: EventFormat.FESTIVAL,
    company: {
      id: '11',
      name: 'Independent Cinema Group',
      logo: 'https://randomuser.me/api/portraits/men/11.jpg'
    },
    currentAttendees: 543,
    showAttendees: 'ATTENDEES_ONLY'
  },
  {
    id: '12',
    title: 'Hackathon: Code for Good',
    description:
      'A 48-hour coding marathon to develop solutions for nonprofit organizations. Prizes for the most innovative projects.',
    poster:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    startDate: '2025-02-10T09:00:00Z',
    endDate: '2025-02-12T18:00:00Z',
    location: {
      address: 'Denver, CO',
      latitude: 39.7392,
      longitude: -104.9903
    },
    price: 0, // Free event
    category: { id: '6', name: 'Technology', description: 'Technology and innovation events' },
    format: EventFormat.WORKSHOP,
    company: {
      id: '12',
      name: 'Tech for Change',
      logo: 'https://randomuser.me/api/portraits/women/12.jpg'
    },
    maxAttendees: 200,
    currentAttendees: 178,
    notifyOrganizer: true,
    attendees: mockUsers.slice(0, 15) // Only showing some attendees
  },
  {
    id: '13',
    title: 'Farmers Market & Craft Fair',
    description: 'Local produce, handmade crafts, and live music. Family-friendly event with activities for children.',
    poster:
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    startDate: '2025-05-15T08:00:00Z',
    endDate: '2025-05-15T14:00:00Z',
    location: {
      address: 'Burlington, VT'
      // Missing latitude/longitude intentionally
    },
    price: 5, // Low price
    category: { id: '9', name: 'Community', description: 'Community and local events' },
    format: EventFormat.OTHER,
    company: {
      id: '13',
      name: 'Downtown Association',
      logo: 'https://randomuser.me/api/portraits/men/13.jpg'
    },
    maxAttendees: 500,
    currentAttendees: 125,
    attendees: mockUsers,
    showAttendees: 'ALL'
  },
  {
    id: '14',
    title: 'Science Fiction Convention',
    description:
      'Meet your favorite authors, attend panel discussions, and participate in cosplay contests. Book signings throughout the weekend.',
    poster:
      'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    startDate: '2025-07-05T10:00:00Z',
    endDate: '2025-07-07T18:00:00Z',
    // Missing location intentionally
    price: 65,
    category: { id: '10', name: 'Entertainment', description: 'Entertainment and pop culture events' },
    format: EventFormat.CONFERENCE,
    company: {
      id: '14',
      name: 'Galaxy Entertainment',
      logo: 'https://randomuser.me/api/portraits/women/14.jpg'
    },
    maxAttendees: 1500,
    attendees: mockUsers,
    currentAttendees: 750,
    redirectUrl: 'https://sci-fi-con.example.com',
    notifyOrganizer: false
  },
  {
    id: '15',
    title: 'Job Fair: Tech Industry',
    description:
      'Connect with recruiters from leading tech companies. Bring your resume and be prepared for on-site interviews.',
    // Missing poster intentionally
    startDate: '2025-03-25T09:00:00Z',
    endDate: '2025-03-25T16:00:00Z',
    location: {
      address: 'Atlanta, GA',
      latitude: 33.749,
      longitude: -84.388
    },
    price: 0, // Free event
    category: { id: '1', name: 'Business', description: 'Business related events' },
    format: EventFormat.OTHER,
    company: {
      id: '15',
      name: 'Career Connect',
      logo: 'https://randomuser.me/api/portraits/men/15.jpg'
    },
    maxAttendees: 2000, // Very large capacity
    currentAttendees: 0, // No attendees yet
    publishDate: '2025-01-15T00:00:00Z' // Future publish date
  },
  {
    id: '16',
    title: 'Cooking Class: Italian Cuisine',
    description: 'Learn to make authentic Italian pasta and sauces from a professional chef. Ingredients provided.',
    poster:
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    startDate: '2025-04-10T18:00:00Z',
    endDate: '2025-04-10T21:00:00Z',
    location: {
      address: 'Philadelphia, PA',
      latitude: 39.9526,
      longitude: -75.1652
    },
    price: 75,
    category: { id: '4', name: 'Food & Drink', description: 'Culinary events' },
    format: EventFormat.WORKSHOP,
    company: {
      id: '16',
      name: 'Culinary Institute',
      logo: 'https://randomuser.me/api/portraits/women/16.jpg'
    },
    maxAttendees: 15, // Very limited capacity
    currentAttendees: 15, // Sold out
    notifyOrganizer: true,
    attendees: mockUsers.slice(0, 15)
  },
  {
    id: '17',
    title: 'Environmental Conservation Summit',
    description:
      'Join environmental experts and activists to discuss climate change solutions and conservation efforts.',
    poster:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    startDate: '2025-05-22T08:30:00Z',
    endDate: '2025-05-23T17:00:00Z',
    location: {
      address: 'Portland, OR',
      latitude: 45.5152,
      longitude: -122.6784
    },
    price: 45,
    attendees: mockUsers,
    category: { id: '11', name: 'Environment', description: 'Environmental and sustainability events' },
    format: EventFormat.CONFERENCE,
    company: {
      id: '1',
      name: 'Green Earth Alliance',
      logo: 'https://randomuser.me/api/portraits/men/17.jpg'
    },
    maxAttendees: 300,
    currentAttendees: 127,
    showAttendees: 'ALL'
  },
  {
    id: '18',
    title: 'Virtual Reality Game Tournament',
    description: 'Compete in VR games for prizes and glory. Spectators welcome to watch the action on big screens.',
    poster:
      'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2012&q=80',
    startDate: '2025-08-15T10:00:00Z',
    endDate: '2025-08-15T22:00:00Z',
    location: {
      address: 'Las Vegas, NV',
      latitude: 36.1699,
      longitude: -115.1398
    },
    price: 25, // Entry fee
    category: { id: '12', name: 'Gaming', description: 'Gaming and e-sports events' },
    format: EventFormat.OTHER,
    company: {
      id: '18',
      name: 'Digital Arena',
      logo: 'https://randomuser.me/api/portraits/women/18.jpg'
    },
    maxAttendees: 100, // Competitors
    currentAttendees: 64,
    notifyOrganizer: true,
    attendees: mockUsers.slice(0, 10)
  }
];
