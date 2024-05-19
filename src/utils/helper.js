export const createDB = () => {
    var db;

  databaseOpen(function() {
    console.log("The database has been opened");
  });

  function databaseOpen(callback) {
    let version = localStorage.getItem('db-version');
    if(!version) version = '1';
    // else version = (parseInt(version) + 1).toString();
    // localStorage.setItem('db-version',version);
    var request = indexedDB.open('todos', parseInt(version));

    // Run migrations if necessary
    request.onupgradeneeded = function(e) {
      db = e.target.result;
      e.target.transaction.onerror = databaseError;
      db.createObjectStore('todo', { keyPath: 'index', autoIncrement: true});
    };

    request.onsuccess = function(e) {
      db = e.target.result;
      callback();
    };


    request.onerror = databaseError;
  }

  function databaseError(e) {
    console.error('An IndexedDB error has occurred', e);
  }

}