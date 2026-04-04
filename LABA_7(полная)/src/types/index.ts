export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  address: {
    city: string;
    country: string;
  };
  company: {
    name: string;
    title: string;
  };
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  reactions?: {
    likes: number;
    dislikes: number;
  };
  createdAt?: string;
}

export interface AppState {
  users: User[];
  products: Product[];
  posts: Post[];
  loading: boolean;
  error: string | null;
}

export type ActionType = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_POSTS'; payload: Post[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'ADD_POST'; payload: Post };