import React from 'react';

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-slate-800/80 backdrop-blur-md ring-1 ring-white/10 rounded-2xl shadow-xl p-6 ${className}`}>
      {children}
    </div>
  );
}

export function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-400 mb-1">
      {children}
    </label>
  );
}

export function Input(props) {
  return (
    <input
      {...props}
      className={`block w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${props.className || ''}`}
    />
  );
}

export function Button({ children, disabled, onClick, variant = 'primary', className = '' }) {
  const baseStyle = "w-full font-semibold rounded-xl py-3 px-4 transition-all duration-200 transform active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white shadow-lg shadow-blue-500/25",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white",
  };
  
  return (
    <button disabled={disabled} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
