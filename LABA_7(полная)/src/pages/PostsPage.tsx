import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';
import { Button } from '../components/UI/Button';
import { Post } from '../types';

export const PostsPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', body: '' });

  useEffect(() => { loadPosts(); }, []);

  const loadPosts = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await api.posts.getAll(5);
      dispatch({ type: 'SET_POSTS', payload: data.posts });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Ошибка загрузки постов' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newPost = await api.posts.add({ ...formData, userId: 1 });
      dispatch({ type: 'ADD_POST', payload: { ...newPost, id: state.posts.length + 1 } });
      setShowForm(false);
      setFormData({ title: '', body: '' });
    } catch (error) {
      alert('Ошибка создания поста');
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-8">
      <section className="bg-white rounded-2xl p-8 shadow-xl mb-8">
        <header className="flex items-center justify-between mb-6 pb-4 border-b-4 border-indigo-600">
          <h2 className="text-3xl font-bold text-indigo-600"><i className="fas fa-newspaper mr-3"></i>Посты о РХТУ</h2>
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold">{state.posts.length} постов</span>
        </header>
        <div className="flex gap-4 mb-6">
          <Button onClick={loadPosts} variant="success"><i className="fas fa-download mr-2"></i>Загрузить</Button>
          <Button onClick={() => setShowForm(!showForm)} variant="warning"><i className="fas fa-plus mr-2"></i>Создать пост</Button>
        </div>
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl mb-6 space-y-4">
            <input type="text" placeholder="Заголовок" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none" required />
            <textarea placeholder="Текст поста" value={formData.body} onChange={(e) => setFormData({ ...formData, body: e.target.value })} className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none h-32" required />
            <Button type="submit" variant="primary"><i className="fas fa-save mr-2"></i>Опубликовать</Button>
          </form>
        )}
        {state.loading && <div className="text-center py-8 text-indigo-600 text-xl">Загрузка...</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {state.posts.map((post: Post) => (
            <article key={post.id} className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold mb-3">{post.title}</h3>
              <p className="text-gray-700 mb-4">{post.body}</p>
              <div className="flex gap-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
                <span><i className="fas fa-heart text-red-500 mr-1"></i>{post.reactions?.likes || 0}</span>
                <span><i className="fas fa-clock mr-1"></i>{new Date(post.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};