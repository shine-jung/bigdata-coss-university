/* eslint-disable no-plusplus */
import { useMemo, useState } from 'react';

const START_YEAR = 2024;

export function useYearSemesterSelector() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const defaultYear = currentMonth === 1 || currentMonth === 2 ? currentYear - 1 : currentYear;
  const defaultSemester = currentMonth >= 3 && currentMonth <= 8 ? '1' : '2';

  const [year, setYear] = useState(defaultYear.toString());
  const [semester, setSemester] = useState(defaultSemester);

  const yearOptions = useMemo(() => {
    const options = [];
    for (let y = START_YEAR; y <= currentYear; y++) {
      options.push(y.toString());
    }
    return options;
  }, [currentYear]);

  return {
    year,
    semester,
    yearOptions,
    setYear,
    setSemester,
  };
}
