import React, {useState} from 'react';
import logo from './logo.svg';
import cx from 'classnames';

import calculateAllTtks, {ShotComboWithTtk} from './utils/ttk-calc';
import './App.scss';

function App() {
  const [bodyshotDamage, setBodyshotDamage] = useState(0);
  const [headshotDamage, setHeadshotDamage] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [enemyHp, setEnemyHp] = useState(0);

  const ttks = calculateAllTtks(bodyshotDamage, headshotDamage, rpm, enemyHp);
  const lowestTtk = ttks[0]?.ttk;
  const highestTtk = ttks[ttks.length - 1]?.ttk;

  return (
    <div className="App">
      <h1>Primary Weapon TTK Calculator</h1>
      <label>
      Body shot damage
        <input 
          name='bodyshotDamage' 
          type='number' 
          step={0.1} 
          value={bodyshotDamage} 
          onChange={e => setBodyshotDamage(parseFloat(e.target.value))} 
        />
      </label>
      <label>
        Head shot damage
        <input 
          name='headshotDamage' 
          type='number' 
          step={0.1} 
          value={headshotDamage} 
          onChange={e => setHeadshotDamage(parseFloat(e.target.value))} 
        />
      </label>
      <label>
        RPM
        <input 
          name='rpm' 
          type='number' 
          step={0.1} 
          value={rpm} 
          onChange={e => setRpm(parseFloat(e.target.value))} 
        />
      </label>
      <label>
        HP
        <input 
          name='hp' 
          type='number' 
          step={0.1} 
          value={enemyHp} 
          onChange={e => setEnemyHp(parseFloat(e.target.value))} 
        />
      </label>
      <table>
        <tr>
          <th></th>
          <th>Body shots</th>
          <th>Head shots</th>
          <th>TTK</th>
          <th>Damage</th>
        </tr>
        {ttks.map((ttk: ShotComboWithTtk) => {
          const isOptimal = ttk.ttk === lowestTtk;
          const isSlowest = ttk.ttk === highestTtk;
          const rowClasses = cx(isOptimal && 'optimal', isSlowest && 'slowest');
          return <tr>
            <td className={rowClasses}>{isOptimal ? 'optimal' : isSlowest ? 'slowest' : ''}</td>
            <td>{ttk.bodyshots}</td>
            <td>{ttk.headshots}</td>
            <td>{ttk.ttk.toFixed(2)}</td>
            <td>{ttk.damage.toFixed(2)}</td>
          </tr>
        })}
      </table>
    </div>
  );
}

export default App;
