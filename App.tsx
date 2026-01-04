
import React, { useState, useMemo, useEffect } from 'react';
import { PROBLEMS } from './constants';
import { Molecule } from './components/Molecule';
import { AtomType } from './types';

const App: React.FC = () => {
  const [problemIndex, setProblemIndex] = useState(0);
  const [coefficients, setCoefficients] = useState<number[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentProblem = PROBLEMS[problemIndex];

  // Initialize coefficients when problem changes
  useEffect(() => {
    const totalInputs = currentProblem.left.length + currentProblem.right.length;
    setCoefficients(Array(totalInputs).fill(1));
    setShowSuccess(false);
  }, [problemIndex]);

  const handleCoefficientChange = (index: number, delta: number) => {
    setCoefficients(prev => {
      const next = [...prev];
      next[index] = Math.max(1, Math.min(9, next[index] + delta));
      return next;
    });
    setShowSuccess(false);
  };

  // Calculate total atoms on each side
  const stats = useMemo(() => {
    const leftCount: Partial<Record<AtomType, number>> = {};
    const rightCount: Partial<Record<AtomType, number>> = {};

    currentProblem.left.forEach((mol, idx) => {
      const coef = coefficients[idx] || 1;
      Object.entries(mol.atoms).forEach(([atom, count]) => {
        const type = atom as AtomType;
        leftCount[type] = (leftCount[type] || 0) + (count || 0) * coef;
      });
    });

    const offset = currentProblem.left.length;
    currentProblem.right.forEach((mol, idx) => {
      const coef = coefficients[offset + idx] || 1;
      Object.entries(mol.atoms).forEach(([atom, count]) => {
        const type = atom as AtomType;
        rightCount[type] = (rightCount[type] || 0) + (count || 0) * coef;
      });
    });

    return { leftCount, rightCount };
  }, [currentProblem, coefficients]);

  const checkAnswer = () => {
    const { leftCount, rightCount } = stats;
    const allAtoms = Array.from(new Set([...Object.keys(leftCount), ...Object.keys(rightCount)])) as AtomType[];
    
    const isCorrect = allAtoms.every(atom => leftCount[atom] === rightCount[atom]);
    
    if (isCorrect) {
      setShowSuccess(true);
    } else {
      alert("左右の原子の数が一致していません。もう一度考えてみよう！");
    }
  };

  const renderInputs = (side: 'left' | 'right') => {
    const items = side === 'left' ? currentProblem.left : currentProblem.right;
    const offset = side === 'left' ? 0 : currentProblem.left.length;

    return items.map((mol, idx) => {
      const globalIdx = offset + idx;
      return (
        <div key={globalIdx} className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-blue-100">
            <button 
              onClick={() => handleCoefficientChange(globalIdx, -1)}
              className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-lg transition-colors"
            >
              -
            </button>
            <span className="w-8 text-center text-xl font-bold text-blue-600">{coefficients[globalIdx]}</span>
            <button 
              onClick={() => handleCoefficientChange(globalIdx, 1)}
              className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-lg transition-colors"
            >
              +
            </button>
            <span className="ml-2 font-bold text-lg text-gray-700">{mol.formula}</span>
          </div>
          {idx < items.length - 1 && side === 'left' && <span className="text-2xl font-bold text-gray-400">+</span>}
          {idx < items.length - 1 && side === 'right' && <span className="text-2xl font-bold text-gray-400">+</span>}
        </div>
      );
    });
  };

  const getAtomDiffText = () => {
    const { leftCount, rightCount } = stats;
    const allAtoms = Array.from(new Set([...Object.keys(leftCount), ...Object.keys(rightCount)])) as AtomType[];
    
    return allAtoms.map(atom => {
      const l = leftCount[atom] || 0;
      const r = rightCount[atom] || 0;
      const match = l === r;
      return (
        <div key={atom} className={`flex items-center gap-2 px-4 py-2 rounded-full border ${match ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'} font-bold transition-all`}>
          <span>{atom}:</span>
          <span>左 {l}</span>
          <span>→</span>
          <span>右 {r}</span>
          {match ? <i className="fa-solid fa-check text-green-500"></i> : <i className="fa-solid fa-xmark text-red-500"></i>}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center max-w-6xl mx-auto">
      {/* Header */}
      <header className="w-full text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2 drop-shadow-sm">
          <i className="fa-solid fa-flask-vial mr-3 text-blue-500"></i>
          化学反応式パズル
        </h1>
        <p className="text-gray-600 font-medium">左右の原子の数を一致させよう！</p>
      </header>

      {/* Problem Selector */}
      <div className="flex flex-wrap justify-center gap-3 mb-8 w-full">
        {PROBLEMS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => setProblemIndex(idx)}
            className={`px-6 py-3 rounded-full font-bold text-sm md:text-base transition-all shadow-md ${
              problemIndex === idx 
              ? 'bg-blue-600 text-white scale-105 ring-4 ring-blue-200' 
              : 'bg-white text-blue-600 hover:bg-blue-50'
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Equation Display and Controls */}
      <div className="w-full bg-white/40 backdrop-blur-sm rounded-3xl p-6 md:p-10 shadow-xl border border-white mb-8 relative overflow-hidden">
        {showSuccess && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-green-500/90 text-white animate-in fade-in zoom-in duration-300">
             <i className="fa-solid fa-face-laugh-beam text-8xl mb-4 animate-bounce"></i>
             <h2 className="text-4xl font-black mb-2">正解！！</h2>
             <p className="text-xl font-bold mb-6">化学反応式が完成したね！</p>
             <button 
                onClick={() => setShowSuccess(false)}
                className="px-8 py-3 bg-white text-green-600 rounded-full font-black hover:bg-green-50 transition-colors shadow-lg"
             >
                もう一度やる
             </button>
          </div>
        )}

        <div className="flex flex-col gap-10">
          {/* Visual Model Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left Side Visuals */}
            <div className="flex flex-col gap-6 items-center">
              <h3 className="text-lg font-bold text-gray-500 bg-blue-100 px-4 py-1 rounded-full">反応前（左辺）</h3>
              <div className="flex flex-wrap gap-8 justify-center min-h-[150px]">
                {currentProblem.left.map((mol, idx) => (
                  <Molecule key={idx} info={mol} coefficient={coefficients[idx]} />
                ))}
              </div>
            </div>

            {/* Right Side Visuals */}
            <div className="flex flex-col gap-6 items-center">
              <h3 className="text-lg font-bold text-gray-500 bg-red-100 px-4 py-1 rounded-full">反応後（右辺）</h3>
              <div className="flex flex-wrap gap-8 justify-center min-h-[150px]">
                {currentProblem.right.map((mol, idx) => (
                  <Molecule 
                    key={idx} 
                    info={mol} 
                    coefficient={coefficients[currentProblem.left.length + idx]} 
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Equation Input Section */}
          <div className="flex flex-wrap items-center justify-center gap-4 bg-white/60 p-6 rounded-2xl border border-blue-100">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {renderInputs('left')}
            </div>
            <div className="flex items-center justify-center px-4">
              <i className="fa-solid fa-arrow-right text-3xl text-blue-400"></i>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {renderInputs('right')}
            </div>
          </div>
        </div>
      </div>

      {/* Progress / Status Section */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          {getAtomDiffText()}
        </div>
        
        <button
          onClick={checkAnswer}
          className="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-black rounded-2xl transition-all shadow-lg active:scale-95"
        >
          判定する！
        </button>
      </div>

      <footer className="mt-12 text-gray-400 text-sm pb-8">
        <p>© 2024 中2理科 化学反応式マスター</p>
      </footer>
    </div>
  );
};

export default App;
