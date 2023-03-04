export type User = {
  id: string;
  name: string;
  lastName: string;
  age?: number;
  religion?: string;
  friends: User[];
  enemies: User[];
};
