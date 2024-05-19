import React, { useState, useEffect } from 'react';
import './App.css';
import AddToDo from './AddToDo';
import ListToDo from './ListToDo';
import { createDB } from './utils/helper';

function App() {
  useEffect(()=>{
    createDB();
  },[]);

  const [list, setList] = useState<Array<Object>>([]);
  const addToList = (item:any) =>{
    setList([...list, item]);
  }

  return (
    <div className="App">
      <h2 className='text-[2em] font-bold'>What's in your Plan?</h2>
      <AddToDo addToList={addToList}/>
      <ListToDo list={list} setList={setList}/>
    </div>
  );
}

export default App;
