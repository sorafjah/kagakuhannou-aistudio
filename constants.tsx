
import { Problem, AtomType } from './types';

export const ATOM_STYLES: Record<AtomType, { color: string; textColor: string; label: string }> = {
  H: { color: 'bg-white border-2 border-gray-300', textColor: 'text-gray-700', label: 'H' },
  O: { color: 'bg-red-500', textColor: 'text-white', label: 'O' },
  Ag: { color: 'bg-gray-400', textColor: 'text-white', label: 'Ag' },
  Na: { color: 'bg-orange-400', textColor: 'text-white', label: 'Na' },
  C: { color: 'bg-gray-800', textColor: 'text-white', label: 'C' }
};

export const PROBLEMS: Problem[] = [
  {
    title: "水の合成",
    left: [
      { formula: "H₂", name: "水素", atoms: { H: 2 } },
      { formula: "O₂", name: "酸素", atoms: { O: 2 } }
    ],
    right: [
      { formula: "H₂O", name: "水", atoms: { H: 2, O: 1 } }
    ],
    targets: [2, 1, 2]
  },
  {
    title: "酸化銀の分解",
    left: [
      { formula: "Ag₂O", name: "酸化銀", atoms: { Ag: 2, O: 1 } }
    ],
    right: [
      { formula: "Ag", name: "銀", atoms: { Ag: 1 } },
      { formula: "O₂", name: "酸素", atoms: { O: 2 } }
    ],
    targets: [2, 4, 1]
  },
  {
    title: "炭酸水素ナトリウムの分解",
    left: [
      { formula: "NaHCO₃", name: "炭酸水素ナトリウム", atoms: { Na: 1, H: 1, C: 1, O: 3 } }
    ],
    right: [
      { formula: "Na₂CO₃", name: "炭酸ナトリウム", atoms: { Na: 2, C: 1, O: 3 } },
      { formula: "H₂O", name: "水", atoms: { H: 2, O: 1 } },
      { formula: "CO₂", name: "二酸化炭素", atoms: { C: 1, O: 2 } }
    ],
    targets: [2, 1, 1, 1]
  }
];
