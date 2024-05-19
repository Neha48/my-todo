import {useState} from 'react';
import { TextField, InputLabel, OutlinedInput, InputAdornment, IconButton, FormControl, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExpandLess } from '@mui/icons-material';

function AddToDo(props:any) {
  const {addToList} = props;
  const [showDescription, setShowDescription] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const handleAddTodo = () => {
    let version = localStorage.getItem('db-version');
    if(!version) version = '1';
    // else version = (parseInt(version) + 1).toString();
    localStorage.setItem('db-version',version);
    var dbRequest = indexedDB.open('todos', parseInt(version));
    dbRequest.onsuccess = (e:any) => {
        var db = dbRequest.result;
          var transaction = db.transaction(['todo'],'readwrite');
          var store = transaction.objectStore('todo');
          var request = store.put({
            task:{title,desc,isDone:false},
            timeStamp: Date.now()
          });
      
          transaction.oncomplete = function(e:any) {
            console.log('added',request.result);
            addToList(request.result);
          }
          request.onerror = (e:any) => console.log('error');
        }
  }
  return (
    <div className='flex flex-col mx-[10rem]'>
    <div className='flex'>
        <FormControl className='w-[40rem] border-1 border-[#fff]' variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Add Todo</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type='text'
            onChange={(e)=>setTitle(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={()=>setShowDescription(!showDescription)}
                >
                  {showDescription ? <ExpandLess/> : <ExpandMoreIcon/>}
                </IconButton>
              </InputAdornment>
            }
            label="title"
          />
        </FormControl>
        <Button className='w-[10rem] h-[3.5rem] mx-[1rem]'
        variant='contained'
        onClick={handleAddTodo}
        >
        Add
        </Button>
    </div>
    {showDescription && <TextField
        className='my-[1rem] w-[45rem] border-1 border-[#fff]'
        id="outlined-multiline-flexible"
        label="Description"
        multiline
        maxRows={5}
        onChange={(e)=>{console.log(e.target.value);setDesc(e.target.value)}}
    />}
    </div>
  )
}

export default AddToDo