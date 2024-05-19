import { Delete, ExpandMore, ExpandLess } from '@mui/icons-material';
import { IconButton, Checkbox, FormControlLabel } from '@mui/material';
import {useState} from 'react'

function TodoCard(props:any) {
  const {item, id} = props;
    const [showDescription, setShowDescription] = useState(false);
    const [isDone, setDone] = useState(item?.isDone);
    const handleCheckChange = () => {
        setDone(!isDone);
        let version = localStorage.getItem('db-version') ?? '1';
        var dbRequest = indexedDB.open('todos', parseInt(version));
        dbRequest.onsuccess = (e:any) => {
        var db = dbRequest.result;
          var transaction = db.transaction(['todo'],'readwrite');
          var store = transaction.objectStore('todo');
          var request = store.put({
            task:{...item,isDone:!isDone},
            timeStamp: Date.now(),
            index:id
          });
      
          transaction.oncomplete = function(e:any) {
            console.log('updated');
          }
          request.onerror = (e:any) => console.log('error');
        }
    }
    const handleDelete = () => {
        let version = localStorage.getItem('db-version') ?? '1';
        var dbRequest = indexedDB.open('todos', parseInt(version));
        dbRequest.onsuccess = (e:any) => {
        var db = dbRequest.result;
          var transaction = db.transaction(['todo'],'readwrite');
          var store = transaction.objectStore('todo');
          var request = store.delete(id);
      
          transaction.oncomplete = function(e:any) {
            console.log('deleted');
          }
          request.onerror = (e:any) => console.log('error');
        }
    }
  return (
    <div className='flex flex-col text-left p-8 rounded-md' style={{backgroundColor:'lightblue'}}>
        <div className='flex justify-between'>
            <FormControlLabel control={<Checkbox checked={isDone} onChange={handleCheckChange}/>} label={item?.title} />
            <div>
                <IconButton onClick={()=>setShowDescription(!showDescription)}>{showDescription ? <ExpandLess/> : <ExpandMore/>}</IconButton>
                <IconButton onClick={handleDelete}><Delete/></IconButton></div>
            </div>
        {showDescription && <pre>{item?.desc}</pre>}
    </div>
  )
}

export default TodoCard;