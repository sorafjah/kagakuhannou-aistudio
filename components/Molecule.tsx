
import React from 'react';
import { MoleculeInfo, AtomType } from '../types';
import { Atom } from './Atom';

interface MoleculeProps {
  info: MoleculeInfo;
  coefficient: number;
}

export const Molecule: React.FC<MoleculeProps> = ({ info, coefficient }) => {
  if (coefficient <= 0) return null;

  // Flatten the atom list based on the formula
  const atomsToRender: AtomType[] = [];
  Object.entries(info.atoms).forEach(([type, count]) => {
    // Fix: Explicitly cast count to number to avoid 'unknown' type comparison error
    const atomCount = count as number;
    for (let i = 0; i < (atomCount || 0); i++) {
      atomsToRender.push(type as AtomType);
    }
  });

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {Array.from({ length: coefficient }).map((_, mIdx) => (
        <div 
          key={mIdx} 
          className="p-3 bg-white/50 rounded-xl border-2 border-dashed border-blue-200 flex flex-wrap items-center justify-center gap-1 min-w-[80px] hover:bg-white/80 transition-colors shadow-sm"
        >
          {atomsToRender.map((type, aIdx) => (
            <Atom key={`${mIdx}-${aIdx}`} type={type} size="md" />
          ))}
          <div className="w-full text-center text-[10px] font-bold text-blue-400 mt-1 uppercase">
            {info.formula}
          </div>
        </div>
      ))}
    </div>
  );
};
