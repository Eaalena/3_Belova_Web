import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';
import { Button } from '../components/UI/Button';
import { Product } from '../types';

export const ProductsPage: React.FC = () => {
  const { state, dispatch } = useAppContext();

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await api.products.getAll(8);
      dispatch({ type: 'SET_PRODUCTS', payload: data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Ошибка загрузки товаров' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadByCategory = async (category: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await api.products.getByCategory(category);
      dispatch({ type: 'SET_PRODUCTS', payload: data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Ошибка загрузки категории' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-8">
      <section className="bg-white rounded-2xl p-8 shadow-xl mb-8">
        <header className="flex items-center justify-between mb-6 pb-4 border-b-4 border-indigo-600">
          <h2 className="text-3xl font-bold text-indigo-600"><i className="fas fa-shopping-bag mr-3"></i>Товары</h2>
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold">{state.products.length} шт.</span>
        </header>
        <div className="flex gap-4 mb-6 flex-wrap">
          <Button onClick={loadProducts} variant="success"><i className="fas fa-list mr-2"></i>Все товары</Button>
          <Button onClick={() => loadByCategory('women\'s clothing')} variant="primary"><i className="fas fa-tshirt mr-2"></i>Одежда</Button>
          <Button onClick={() => loadByCategory('electronics')} variant="warning"><i className="fas fa-laptop mr-2"></i>Электроника</Button>
        </div>
        {state.loading && <div className="text-center py-8 text-indigo-600 text-xl">Загрузка...</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.products.map((product: Product) => (
            <article key={product.id} className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
              <img src={product.image} alt={product.title} className="w-full h-48 object-contain bg-gray-50" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x180?text=No+Image'; }} />
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2 line-clamp-2">{product.title}</h3>
                <p className="text-2xl font-bold text-indigo-600 mb-2">{product.price} ₽</p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex gap-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
                  <span><i className="fas fa-star text-yellow-500 mr-1"></i>{product.rating.rate}</span>
                  <span><i className="fas fa-tag mr-1"></i>{product.category}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};