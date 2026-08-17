import { createContext, ReactNode, useContext, useState } from 'react';
import { GlucoseReading } from '../types';

interface ReadingsContextValue {
  readings: GlucoseReading[];
  addReading: (reading: GlucoseReading) => void;
}

const ReadingsContext = createContext<ReadingsContextValue | undefined>(undefined);

export function ReadingsProvider({ children }: { children: ReactNode }) {
  const [readings, setReadings] = useState<GlucoseReading[]>([]);

  const addReading = (reading: GlucoseReading) => {
    setReadings((prev) => [reading, ...prev]);
  };

  return (
    <ReadingsContext.Provider value={{ readings, addReading }}>
      {children}
    </ReadingsContext.Provider>
  );
}

export function useReadings() {
  const context = useContext(ReadingsContext);
  if (!context) {
    throw new Error('useReadings must be used within a ReadingsProvider');
  }
  return context;
}
