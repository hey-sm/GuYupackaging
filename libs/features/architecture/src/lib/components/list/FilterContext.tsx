import { createContext } from 'react';

export type FilterContextType = React.ReactNode[];

/**
 * Make filters accessible to sub components
 */
export const FilterContext = createContext<FilterContextType | undefined>(
  undefined
);
