import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/UI/Button';

export const HomePage: React.FC = () => (
  <main className="max-w-6xl mx-auto p-8">
    <section className="text-center py-20">
      <h2 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">
        <i className="fas fa-code mr-4"></i>
        Работа с API
      </h2>
      <p className="text-xl text-white/90 mb-8">GET • POST • PUT • DELETE</p>
      <div className="flex gap-4 justify-center flex-wrap">
        <Link to="/users">
          <Button variant="success" className="text-lg px-8 py-4">
            <i className="fas fa-users mr-2"></i> Пользователи
          </Button>
        </Link>
        <Link to="/products">
          <Button variant="warning" className="text-lg px-8 py-4">
            <i className="fas fa-shopping-bag mr-2"></i> Товары
          </Button>
        </Link>
        <Link to="/posts">
          <Button variant="danger" className="text-lg px-8 py-4">
            <i className="fas fa-newspaper mr-2"></i> Посты
          </Button>
        </Link>
      </div>
    </section>
  </main>
);