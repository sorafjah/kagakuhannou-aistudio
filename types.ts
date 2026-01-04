
export type AtomType = 'H' | 'O' | 'Ag' | 'Na' | 'C';

export interface MoleculeInfo {
  formula: string;
  atoms: Partial<Record<AtomType, number>>;
  name: string;
}

export interface Problem {
  title: string;
  left: MoleculeInfo[];
  right: MoleculeInfo[];
  targets: number[]; // The standard coefficients
}
