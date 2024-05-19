import { useEffect, useState } from 'react';
import TodoCard from './TodoCard';

function ListToDo(props:any) {
  const {list, setList} = props;
  useEffect(()=>{
    let version = localStorage.getItem('db-version');
    if(!version) version = '1';
    // else version = (parseInt(version) + 1).toString();
    localStorage.setItem('db-version',version);
    var dbRequest = indexedDB.open('todos', parseInt(version));
    dbRequest.onsuccess = (e:any) => {
        var db = dbRequest.result;
        if(!db.objectStoreNames.contains('todo'))
          db.createObjectStore('todo', { keyPath: 'index', autoIncrement: true })
        else {
          var transaction = db.transaction(['todo'],'readonly');
          var store = transaction.objectStore('todo');
          var request = store.getAll();
      
          transaction.oncomplete = function(e:any) {
            setList(request.result);
          }
          transaction.onerror = (e:any) => console.log(e);
          
          request.onerror = (e:any) => console.log('error');
        }
    }
  },[list]);
  return (
    <div className='flex flex-col gap-4 my-10'>
      {list?.map((todo:any) => (
          <TodoCard item={todo.task} key={todo.index} id={todo.index}/>
      ))}
    </div>
  )
}

export default ListToDo;