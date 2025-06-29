import React from 'react';
import SalaryCalculator from './components/salary-calculator/SalaryCalculator';
import Version from './components/Version';
import './App.css';

function App() {
  return (
    <div className="App">
      <SalaryCalculator />
      <Version />
    </div>
  );
}

export default App;