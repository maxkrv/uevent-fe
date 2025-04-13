export enum NotificationChannel {
  EMAIL = 'EMAIL',
  IN_APP = 'IN_APP',
  BOTH = 'BOTH',
  NONE = 'NONE'
}

export enum AuthProvider {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'USER' | 'ADMIN';
  emailVerified: boolean;
  showInAttendeeList: boolean;
  authProvider: AuthProvider;
  eventReminderChannel: NotificationChannel;
  ticketPurchaseChannel: NotificationChannel;
  newCommentChannel: NotificationChannel;
  companyUpdateChannel: NotificationChannel;
}
