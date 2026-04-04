import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';
import { Button } from '../components/UI/Button';
import { User } from '../types';

export const UsersPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', age: 25, phone: '', city: '', company: '',
  });

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await api.users.getAll(10);
      dispatch({ type: 'SET_USERS', payload: data.users });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Ошибка загрузки пользователей' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newUser = await api.users.add({
        ...formData,
        address: { city: formData.city || 'Москва', country: 'Россия' },
        company: { name: formData.company || 'ООО Пример', title: 'Специалист' },
      });
      dispatch({ type: 'ADD_USER', payload: { ...newUser, id: state.users.length + 1 } });
      setShowForm(false);
      setFormData({ firstName: '', lastName: '', email: '', age: 25, phone: '', city: '', company: '' });
    } catch (error) {
      alert('Ошибка создания пользователя');
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-8">
      <section className="bg-white rounded-2xl p-8 shadow-xl mb-8">
        <header className="flex items-center justify-between mb-6 pb-4 border-b-4 border-indigo-600">
          <h2 className="text-3xl font-bold text-indigo-600"><i className="fas fa-users mr-3"></i>Пользователи</h2>
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold">{state.users.length} чел.</span>
        </header>
        <div className="flex gap-4 mb-6">
          <Button onClick={loadUsers} variant="success"><i className="fas fa-download mr-2"></i>Загрузить</Button>
          <Button onClick={() => setShowForm(!showForm)} variant="warning"><i className="fas fa-plus mr-2"></i>Создать</Button>
        </div>
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl mb-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Имя" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none" required />
              <input type="text" placeholder="Фамилия" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none" required />
            </div>
            <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none" required />
            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="Возраст" value={formData.age} onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 25 })} className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none" />
              <input type="text" placeholder="Телефон" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none" />
            </div>
            <input type="text" placeholder="Город" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none" />
            <input type="text" placeholder="Компания" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none" />
            <Button type="submit" variant="primary"><i className="fas fa-save mr-2"></i>Сохранить</Button>
          </form>
        )}
        {state.loading && <div className="text-center py-8 text-indigo-600 text-xl">Загрузка...</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.users.map((user: User) => (
            <article key={user.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl transition-shadow">
              <img src={`https://i.pravatar.cc/300?u=${user.id}`} alt={`${user.firstName} ${user.lastName}`} className="w-full h-48 object-cover rounded-lg mb-4" />
              <h3 className="text-xl font-bold mb-2">{user.firstName} {user.lastName}</h3>
              <p className="text-gray-600 mb-1"><i className="fas fa-envelope mr-2"></i>{user.email}</p>
              <p className="text-gray-600 mb-1"><i className="fas fa-briefcase mr-2"></i>{user.company.title}</p>
              <div className="flex gap-4 mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
                <span><i className="fas fa-birthday-cake mr-1"></i>{user.age} лет</span>
                <span><i className="fas fa-map-marker-alt mr-1"></i>{user.address.city}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};