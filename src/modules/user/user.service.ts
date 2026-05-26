export class UserService {
  async getUsers() {
    // throw new Error('test err!')
    return [{ id: 1, name: 'Shashi' }];
  }

  async createUser(data: any) {
    return { id: Date.now(), ...data };
  }
}