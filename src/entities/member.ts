export type Member = {
  id: string;
  email: string;
  password: string;
  name: string;
  lastName: string;
  age?: number;
  religion?: string;
  friends: Member[];
  enemies: Member[];
};
