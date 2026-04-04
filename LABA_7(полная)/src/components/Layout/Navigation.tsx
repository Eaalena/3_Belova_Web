import React from 'react';
import { NavLink } from 'react-router-dom';

export const Navigation: React.FC = () => {
  return (
    <nav className="site-nav bg-white/95 backdrop-blur shadow-sm">
      <ul className="flex justify-center gap-4 p-4 flex-wrap list-none">
        <li>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                isActive ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-800 hover:bg-indigo-600 hover:text-white'
              }`
            }
          >
            <i className="fas fa-users"></i>
            Пользователи
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                isActive ? 'bg-indigo-600 text-white shadow-lg'