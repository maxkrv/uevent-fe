import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';

import { Comment } from '../modules/comments/interfaces/comment.interface';
import { Reaction, ReactionType } from '../modules/comments/interfaces/reaction.interface';
import { Company, CompanySubscription } from '../modules/company/interfaces/company.interface';
import { CompanyNews } from '../modules/company/interfaces/news.interface';
import {
  Event,
  EventAttendee,
  EventFormatType,
  EventSubscription,
  EventThemeType,
  Location
} from '../modules/event/interfaces/event.interface';
import { Notification } from '../modules/notification/interfaces/notification.interface';
import { Payment, PaymentStatusType } from '../modules/ticket/interfaces/payment.interface';
import { Ticket, TicketStatusType } from '../modules/ticket/interfaces/ticket.interface';
import {
  AuthProviderType,
  NotificationChannelType,
  User,
  UserRole,
  UserSettings
} from '../modules/user/interfaces/user.interface';

// Helper functions
const getRandomEnum = <T extends Record<string, string | number>>(enumObj: T): T[keyof T] => {
  const values = Object.values(enumObj) as T[keyof T][];
  return values[Math.floor(Math.random() * values.length)];
};

const getRandomEnums = <T extends Record<string, string | number>>(enumObj: T, count = 1): T[keyof T][] => {
  const values = Object.values(enumObj) as T[keyof T][];
  const shuffled = [...values].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getRandomArrayItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomArrayItems = <T>(array: T[], min = 1, max = 3): T[] => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

interface GenerateCountOptions {
  users: number;
  companies: number;
  locations: number;
  events: number;
  news: number;
  comments: number;
  reactions: number;
  notifications: number;
}

interface MockData {
  users: User[];
  userSettings: UserSettings[];
  companies: Company[];
  locations: Location[];
  events: Event[];
  eventAttendees: EventAttendee[];
  eventSubscriptions: EventSubscription[];
  companySubscriptions: CompanySubscription[];
  tickets: Ticket[];
  payments: Payment[];
  companyNews: CompanyNews[];
  comments: Comment[];
  reactions: Reaction[];
  notifications: Notification[];
}

// Generate mock data
const generateMockData = (count: Partial<GenerateCountOptions> = {}): MockData => {
  const options: GenerateCountOptions = {
    users: count.users || 20,
    companies: count.companies || 10,
    locations: count.locations || 30,
    events: count.events || 50,
    news: count.news || 30,
    comments: count.comments || 100,
    reactions: count.reactions || 200,
    notifications: count.notifications || 80
  };

  // Create collections
  const users: User[] = [];
  const userSettings: UserSettings[] = [];
  const companies: Company[] = [];
  const locations: Location[] = [];
  const events: Event[] = [];
  const eventAttendees: EventAttendee[] = [];
  const eventSubscriptions: EventSubscription[] = [];
  const companySubscriptions: CompanySubscription[] = [];
  const tickets: Ticket[] = [];
  const payments: Payment[] = [];
  const companyNews: CompanyNews[] = [];
  const comments: Comment[] = [];
  const reactions: Reaction[] = [];
  const notifications: Notification[] = [];

  // Generate locations first
  for (let i = 0; i < options.locations; i++) {
    locations.push({
      id: faker.string.uuid(),
      address: faker.location.streetAddress({ useFullAddress: true }),
      lat: Number.parseFloat(faker.location.latitude().toPrecision()),
      lng: Number.parseFloat(faker.location.longitude().toPrecision())
    });
  }

  // Generate user settings
  for (let i = 0; i < options.users; i++) {
    userSettings.push({
      id: faker.string.uuid(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      showInAttendeeList: faker.datatype.boolean(),
      showFollowingList: faker.datatype.boolean(),
      eventReminderChannel: getRandomEnum(NotificationChannelType),
      ticketPurchaseChannel: getRandomEnum(NotificationChannelType),
      newCommentChannel: getRandomEnum(NotificationChannelType),
      companyUpdateChannel: getRandomEnum(NotificationChannelType),
      themeMainColor: faker.internet.color()
    });
  }

  // Generate users
  for (let i = 0; i < options.users; i++) {
    const settings = userSettings[i];
    users.push({
      id: faker.string.uuid(),
      email: faker.internet.email(),
      password: i < options.users * 0.8 ? faker.internet.password() : undefined, // 80% have password
      name: faker.person.fullName(),
      avatar: faker.image.avatar(),
      bio: faker.datatype.boolean() ? faker.person.bio() : undefined,
      authProvider: i < options.users * 0.8 ? AuthProviderType.EMAIL : AuthProviderType.GOOGLE,
      role: i < options.users * 0.1 ? UserRole.ADMIN : UserRole.USER, // 10% are admins
      emailVerified: faker.datatype.boolean(0.9), // 90% verified
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      settingsId: settings.id,
      settings: settings
    });
  }

  // Update settings with user reference
  userSettings.forEach((setting, index) => {
    setting.user = [users[index]];
  });

  // Generate companies
  for (let i = 0; i < options.companies; i++) {
    const location = locations[i];
    const owner = getRandomArrayItem(users);

    companies.push({
      id: faker.string.uuid(),
      name: faker.company.name(),
      email: faker.internet.email(),
      description: faker.company.catchPhrase(),
      logo: faker.image.urlLoremFlickr({ category: 'business' }),
      website: faker.internet.url(),
      coverImage: faker.image.urlLoremFlickr({ category: 'business' }),
      locationId: location.id,
      stripeAccountId: faker.datatype.boolean(0.7) ? `acct_${faker.string.alphanumeric(16)}` : undefined,
      isVerified: faker.datatype.boolean(0.8), // 80% verified
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ownerId: owner.id,
      location: location,
      owner: owner
    });
  }

  // Add companies to users
  users.forEach((user) => {
    if (faker.datatype.boolean(0.3)) {
      // 30% of users own companies
      user.companies = getRandomArrayItems(companies, 0, 2);
    }
  });

  // Generate company news
  for (let i = 0; i < options.news; i++) {
    const company = getRandomArrayItem(companies);

    companyNews.push({
      id: faker.string.uuid(),
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(),
      imageUrl: faker.datatype.boolean(0.7) ? faker.image.urlLoremFlickr({ category: 'business' }) : undefined,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      companyId: company.id,
      company: company
    });
  }

  // Generate events
  for (let i = 0; i < options.events; i++) {
    const company = getRandomArrayItem(companies);
    const creator = getRandomArrayItem(users);
    const location = getRandomArrayItem(locations);
    const startDate = faker.date.future();
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + Math.floor(Math.random() * 48) + 1); // 1-48 hours later

    events.push({
      id: faker.string.uuid(),
      title: faker.lorem.words({ min: 2, max: 6 }),
      description: faker.lorem.paragraphs(),
      posterUrl: faker.datatype.boolean(0.8) ? faker.image.urlLoremFlickr({ category: 'event' }) : undefined,
      startDate: startDate,
      endDate: endDate,
      price: faker.datatype.boolean(0.3) ? 0 : parseFloat(faker.commerce.price({ min: 5, max: 500 })),
      maxAttendees: faker.datatype.boolean(0.7) ? faker.number.int({ min: 10, max: 1000 }) : undefined,
      publishDate: faker.date.past(),
      showAttendeeList: faker.datatype.boolean(0.8),
      notifyOnNewAttendee: faker.datatype.boolean(0.5),
      redirectUrl: faker.datatype.boolean(0.3) ? faker.internet.url() : undefined,
      format: getRandomEnum(EventFormatType),
      stripeProductId: faker.datatype.boolean(0.7) ? `prod_${faker.string.alphanumeric(14)}` : undefined,
      stripePriceId: faker.datatype.boolean(0.7) ? `price_${faker.string.alphanumeric(14)}` : undefined,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      locationId: location.id,
      companyId: company.id,
      creatorId: creator.id,
      creator: creator,
      company: company,
      location: location,
      themes: getRandomEnums(EventThemeType, Math.floor(Math.random() * 3) + 1)
    });
  }

  // Generate event attendees, subscriptions, and tickets
  events.forEach((event) => {
    const attendeeCount = Math.floor(Math.random() * 20) + 1;
    const attendees: EventAttendee[] = [];

    for (let i = 0; i < attendeeCount; i++) {
      if (i >= users.length) break;

      const user = users[i];
      const attendee: EventAttendee = {
        id: faker.string.uuid(),
        createdAt: faker.date.between({
          from: event.publishDate,
          to: dayjs(event.publishDate).add(1, 'year').toDate()
        }),
        userId: user.id,
        eventId: event.id,
        event: event,
        user: user
      };

      eventAttendees.push(attendee);
      attendees.push(attendee);

      // Create ticket for this attendee
      const ticket: Ticket = {
        id: faker.string.uuid(),
        purchaseDate: attendee.createdAt,
        status: getRandomEnum(TicketStatusType),
        attendeeId: attendee.id,
        promoCodeId: faker.datatype.boolean(0.2) ? faker.string.uuid() : undefined,
        eventId: event.id,
        userId: user.id,
        event: event,
        user: user,
        attendee: attendee
      };

      tickets.push(ticket);

      // Create payment for this ticket if it's not free
      if (event.price > 0) {
        const payment: Payment = {
          id: faker.string.uuid(),
          amount: event.price,
          status: getRandomEnum(PaymentStatusType),
          paymentIntent: faker.datatype.boolean(0.8) ? `pi_${faker.string.alphanumeric(24)}` : undefined,
          createdAt: ticket.purchaseDate,
          updatedAt: faker.date.between({
            from: ticket.purchaseDate,
            to: dayjs(ticket.purchaseDate).add(1, 'year').toDate()
          }),
          userId: user.id,
          ticketId: ticket.id,
          user: user,
          ticket: ticket
        };

        payments.push(payment);
        ticket.payment = payment;
      }

      // Update attendee with ticket
      attendee.ticket = ticket;
    }

    // Add attendees to event
    event.attendees = attendees;

    // Generate event subscriptions
    const subscriberCount = Math.floor(Math.random() * 30) + 5;
    const subscribers: EventSubscription[] = [];

    for (let i = 0; i < subscriberCount; i++) {
      if (i >= users.length) break;

      const user = users[i];
      const subscription: EventSubscription = {
        id: faker.string.uuid(),
        createdAt: faker.date.between({
          from: event.publishDate,
          to: dayjs(event.publishDate).add(1, 'year').toDate()
        }),
        userId: user.id,
        eventId: event.id,
        event: event,
        user: user
      };

      eventSubscriptions.push(subscription);
      subscribers.push(subscription);
    }

    // Add subscribers to event
    event.subscribers = subscribers;
  });

  // Generate company subscriptions
  companies.forEach((company) => {
    const subscriberCount = Math.floor(Math.random() * 50) + 10;

    for (let i = 0; i < subscriberCount; i++) {
      if (i >= users.length) break;

      const user = users[i];
      const subscription: CompanySubscription = {
        id: faker.string.uuid(),
        createdAt: faker.date.past(),
        companyId: company.id,
        userId: user.id,
        user: user,
        company: company
      };

      companySubscriptions.push(subscription);

      // Add to company's subscribers
      if (!company.subscribers) company.subscribers = [];
      company.subscribers.push(subscription);
    }
  });

  // Generate comments
  for (let i = 0; i < options.comments; i++) {
    const user = getRandomArrayItem(users);
    const isEventComment = faker.datatype.boolean();
    let eventId: string | undefined;
    let companyNewsId: string | undefined;
    let event: Event | undefined;
    let news: CompanyNews | undefined;

    if (isEventComment) {
      event = getRandomArrayItem(events);
      eventId = event.id;
    } else {
      news = getRandomArrayItem(companyNews);
      companyNewsId = news.id;
    }

    const comment: Comment = {
      id: faker.string.uuid(),
      content: faker.lorem.paragraph(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      eventId: eventId,
      companyNewsId: companyNewsId,
      userId: user.id,
      event: event,
      companyNews: news,
      user: user,
      replies: []
    };

    comments.push(comment);

    // Add to event or news comments
    if (isEventComment && event) {
      if (!event.comments) event.comments = [];
      event.comments.push(comment);
    } else if (news) {
      if (!news.comments) news.comments = [];
      news.comments.push(comment);
    }
  }

  // Add replies to comments
  const replyCount = Math.floor(options.comments * 0.4); // 40% of comments are replies
  for (let i = 0; i < replyCount; i++) {
    const parentComment = getRandomArrayItem(comments);
    const user = getRandomArrayItem(users);

    const reply: Comment = {
      id: faker.string.uuid(),
      content: faker.lorem.paragraph(),
      parentId: parentComment.id,
      createdAt: faker.date.between({
        from: parentComment.createdAt,
        to: dayjs(parentComment.createdAt).add(1, 'year').toDate()
      }),
      updatedAt: faker.date.recent(),
      eventId: parentComment.eventId,
      companyNewsId: parentComment.companyNewsId,
      userId: user.id,
      event: parentComment.event,
      companyNews: parentComment.companyNews,
      user: user,
      replyTo: parentComment
    };

    comments.push(reply);
    parentComment.replies?.push(reply);
  }

  // Generate reactions
  for (let i = 0; i < options.reactions; i++) {
    const user = getRandomArrayItem(users);
    const isCommentReaction = faker.datatype.boolean(0.7); // 70% are comment reactions
    let commentId: string | undefined;
    let newsId: string | undefined;
    let comment: Comment | undefined;
    let news: CompanyNews | undefined;

    if (isCommentReaction) {
      comment = getRandomArrayItem(comments);
      commentId = comment.id;
    } else {
      news = getRandomArrayItem(companyNews);
      newsId = news.id;
    }

    const reaction: Reaction = {
      id: faker.string.uuid(),
      type: getRandomEnum(ReactionType),
      createdAt: faker.date.recent(),
      userId: user.id,
      commentId: commentId,
      newsId: newsId,
      comment: comment,
      news: news,
      user: user
    };

    reactions.push(reaction);

    // Add to comment or news reactions
    if (isCommentReaction && comment) {
      if (!comment.reactions) comment.reactions = [];
      comment.reactions.push(reaction);
    } else if (news) {
      if (!news.reaction) news.reaction = [];
      news.reaction.push(reaction);
    }
  }

  // Generate notifications
  for (let i = 0; i < options.notifications; i++) {
    const user = getRandomArrayItem(users);
    const sentBy = faker.datatype.boolean(0.7) ? getRandomArrayItem(users) : undefined;

    const notificationTypes = [
      'EVENT_REMINDER',
      'TICKET_PURCHASE',
      'NEW_COMMENT',
      'COMPANY_UPDATE',
      'EVENT_CANCELLED',
      'PAYMENT_CONFIRMED',
      'NEW_FOLLOWER'
    ];

    const type = getRandomArrayItem(notificationTypes);

    const notification: Notification = {
      id: faker.string.uuid(),
      type: type,
      title: `${type.charAt(0)}${type.slice(1).toLowerCase().replace('_', ' ')}`,
      content: faker.lorem.sentence(),
      isRead: faker.datatype.boolean(0.5),
      createdAt: faker.date.recent(),
      userId: user.id,
      sentById: sentBy?.id,
      user: user,
      sentBy: sentBy
    };

    notifications.push(notification);
  }

  // Update user references
  users.forEach((user) => {
    user.tickets = tickets.filter((ticket) => ticket.userId === user.id);
    user.comments = comments.filter((comment) => comment.userId === user.id);
    user.notifications = notifications.filter((notification) => notification.userId === user.id);
    user.sentNotifications = notifications.filter((notification) => notification.sentById === user.id);
    user.attendingEvents = eventAttendees.filter((attendee) => attendee.userId === user.id);
    user.subscribedEvents = eventSubscriptions.filter((sub) => sub.userId === user.id);
    user.subscribedCompanies = companySubscriptions.filter((sub) => sub.userId === user.id);
    user.payments = payments.filter((payment) => payment.userId === user.id);
    user.reaction = reactions.filter((reaction) => reaction.userId === user.id);
  });

  return {
    users,
    userSettings,
    companies,
    locations,
    events,
    eventAttendees,
    eventSubscriptions,
    companySubscriptions,
    tickets,
    payments,
    companyNews,
    comments,
    reactions,
    notifications
  };
};

// Generate the mock data
export const mockData = generateMockData();
