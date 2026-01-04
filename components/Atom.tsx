
import React from 'react';
import { AtomType } from '../types';
import { ATOM_STYLES } from '../constants';

interface AtomProps {
  type: AtomType;
  size?: 'sm' | 'md' | 'lg';
}

export const Atom: React.FC<AtomProps> = ({ type, size = 'md' }) => {
  const style = ATOM_STYLES[type];
  const sizeClass = size === 'sm' ? 'w-6 h-6 text-xs' : size === 'md' ? 'w-10 h-10 text-sm' : 'w-14 h-14 text-base';
  
  return (
    <div className={`${style.color} ${sizeClass} rounded-full flex items-center justify-center font-bold shadow-sm transition-all duration-300`}>
      <span className={style.textColor}>{style.label}</span>
    </div>
  );
};
