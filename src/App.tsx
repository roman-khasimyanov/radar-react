import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Radar } from './components/Radar';

function App() {
  return (
    <div className="App">
      <Radar
        data={
          [
            {
              key: 'rnd-domain-1',
              values: new Array(4).fill(1).map((_, i) => (
                {
                  key: `rnd-${i}`,
                  label: `val-${i}`,
                  level: Math.round(Math.random() * 10) % 10,
                }
              ))
            },
            {
              key: 'rnd-domain-2',
              values: new Array(5).fill(1).map((_, i) => (
                {
                  key: `rnd-${i}`,
                  label: `val-${i}`,
                  level: Math.round(Math.random() * 10) % 10,
                }
              ))
            },
            {
              key: 'rnd-domain-5',
              values: new Array(3).fill(1).map((_, i) => (
                {
                  key: `rnd-${i}`,
                  label: `val-${i}`,
                  level: Math.round(Math.random() * 10) % 10,
                }
              ))
            }
          ]
        }
      />
    </div>
  );
}

export default App;
