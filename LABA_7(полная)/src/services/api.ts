const API_BASE = {
  users: 'https://dummyjson.com/users',
  products: 'https://fakestoreapi.com/products',
  posts: 'https://dummyjson.com/posts',
};

export const api = {
  users: {
    getAll: (limit = 10) => 
      fetch(`${API_BASE.users}?limit=${limit}`).then(res => res.json()),
    add: (data: any) => 
      fetch(`${API_BASE.users}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
  },
  products: {
    getAll: (limit = 8) => 
      fetch(`${API_BASE.products}?limit=${limit}`).then(res => res.json()),
    getByCategory: (category: string) => 
      fetch(`${API_BASE.products}/category/${category}`).then(res => res.json()),
    add: (data: any) => 
      fetch(API_BASE.products, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
  },
  posts: {
    getAll: (limit = 5) => 
      fetch(`${API_BASE.posts}?limit=${limit}`).then(res => res.json()),
    add: (data: any) => 
      fetch(`${API_BASE.posts}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
  },
};