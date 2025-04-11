import { apiClient } from '../../../shared/api/api';
import { User } from '../interfaces/user.interface';

export class UserService {
  static async me() {
    return apiClient.get<User>('users/me').json();
  }
}
// import { useMe } from '../queries/use-me-query';
