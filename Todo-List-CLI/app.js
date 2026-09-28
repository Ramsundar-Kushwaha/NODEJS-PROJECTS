// Requiring module
const fs = require('fs');

// Accessing arguments
const args = process.argv;

// The "app.js" is 6 character long
// so -6 removes last 8 characters
const currentWorkingDirectory = args[1].slice(0, -6);


// Check todo.txt existence
if(fs.existsSync(currentWorkingDirectory + 'todo.txt') === false){
    let createStream = fs.createWriteStream('todo.txt');
    createStream.end();
}

// check done.txt existence
if(fs.existsSync(currentWorkingDirectory + 'done.txt') === false){
    let createStream = fs.createWriteStream('done.txt');
    createStream.end();
}

// Display usage format
const infoFunction = () => {
    const usageText = `
    Usage :-
    $ node app.js add "todo item"  # Add a new todo
    $ node app.js ls               # Show remaining todos
    $ node app.js del NUMBER       # Delete a todo
    $ node app.js done NUMBER      # Complete a todo
    $ node app.js help             # Show usage
    $ node app.js report           # Statistics`;

    console.log(usageText);
};


// List function
const listFunction = () => {

    // Create a empty array
    let data = [];

    // Read from todo.txt and convert it
    // into a string
    const fileData = fs.readFileSync(currentWorkingDirectory + 'todo.txt').toString();

    // Split the string and store into array
    data = fileData.split('\n');

    // Filter the string for any empty lines in the file
    let filterData = data.filter(function (value) {
        return value !== '';
    });

    if (filterData.length === 0) {
        console.log('There is no pending todos!');
    }

    for(let i = 0; i < filterData.length; i++){
        console.log((i + 1) + '. ' + filterData[i]);
    }
};

// Add function
const addFunction = () => {

    // New todo string argument is stored
    const newTask = args[3];

    // if argument is passed
    if(newTask){

        // Create empty array
        let data = [];

        // Read the data from file todo.txt and
        // Convert it in string
        const fileData = fs.readFileSync(currentWorkingDirectory + 'todo.txt').toString();

        // New task is added to previous data
        fs.appendFile(currentWorkingDirectory + 'todo.txt', '\n' + newTask, (err) => {
            if(err){
                throw err;
            }
            console.log('Added todo: "' + newTask + '"');
        });
    }
    else{
        console.log("Error: Missing todo string. Nothing added!");
    }
};

// Delete function
const deleteFunction = () => {

    // Store which index is passed
    const deleteIndex = args[3];

    if (deleteIndex) {

        // Create a empty array
        let data = [];

        // Read the data from file and convert
        // it into string
        const fileData = fs.readFileSync(currentWorkingDirectory + 'todo.txt').toString();

        data = fileData.split('\n');

        // Filter the data for any empty lines
        let filterData = data.filter(function (value){
            return value !== '';
        });

        // If delete the data for any empty lines
        if(deleteIndex > filterData.length || deleteIndex <= 0){
            console.log('Error: todo #' + deleteIndex + ' does not exist. Nothing deleted.');
        }else{

            // Remove the task
            filterData.splice(deleteIndex - 1, 1);

            // Join the array to form a string
            const newData = filterData.join('\n');

            // Write the new data back in file
            fs.writeFile(currentWorkingDirectory + 'todo.txt', newData, function(err) {
                if(err) throw err;

                // Logs the deleted index
                console.log('Deleted todo #' + deleteIndex);
            });
        }
    }else{
        console.log('Error: Missing Number for deleting todo.');
    }
};

// Done function
const doneFunction = () => {

    // Store the index passed as argument
    const doneIndex = args[3];

    // If argument is passed
    if(doneIndex){
        let data = [];

        // Create a new date object
        let dateObj = new Date();

        // Conver it to string and slice only the
        // date part, removing the time part
        let dateString = dateObj.toISOString().substring(0, 10);

        // Read the data from todo.txt
        const fileData = fs.readFileSync(currentWorkingDirectory + 'todo.txt').toString();

        // Read the data from done.txt
        const doneData = fs.readFileSync(currentWorkingDirectory + 'done.txt').toString();

        // Split the todo.txt data
        data = fileData.split('\n');

        // Filter for any empty lines
        let filterData = data.filter(function (value) {
            return value !== '';
        });

        // If done index is greater than no. of task or <= 0
        if(doneIndex > filterData.length || doneIndex <= 0){
            console.log('Error: todo #' + doneIndex + ' does not exist');
        }else{

            // Delete the task from the todo.txt
            // data and store it
            const deleted = filterData.splice(doneIndex - 1, 1);

            // Join the array to create a string
            const newData = filterData.join('\n');
            

            // write back the data in todo.txt
            fs.writeFile(currentWorkingDirectory + 'todo.txt', newData, function (err){
                if (err) throw err;
            });

            // Write the stored task in done.txt
            // along with date string
            fs.writeFile(currentWorkingDirectory + 'done.txt', 'x ' + dateString + ' ' + deleted + '\n' + doneData, function(err){
                if (err) throw err;
                console.log('Marked todo #' + doneIndex + ' as done.');
            });
        }
    }else{
        console.log('Error: Missing NUMBER for' + ' marking todo as done.');
    }
};

// Report function
const reportFunction = () => {
    // let todoData = [];
    // let doneData = [];

    // Read data from both files
    const todo = fs.readFileSync(currentWorkingDirectory + 'todo.txt').toString();
    const done = fs.readFileSync(currentWorkingDirectory + 'done.txt').toString();

    // Splite the data from both files
    const todoData = todo.split('\n');
    const doneData = done.split('\n');


    // Filter valid data
    const filterTodoData = todoData.filter(function(values){
        return values !== '';
    });
    const filterDoneData = doneData.filter(function(values){
        return values !== '';
    });

    // Create date object
    const dateObj = new Date();
    const stringDate = dateObj.toISOString().substring(0, 10);
    console.log(stringDate + ' ' + 'Pending : ' + filterTodoData.length + ' | Completed : ' + filterDoneData.length);
};

// Handels command
switch (args[2]){
    case 'ls':
        listFunction();
        break;
    case 'add':
        addFunction();
        break;
    case 'del':
        deleteFunction();
        break;
    case 'done':
        doneFunction();
        break;
    case 'report':
        reportFunction();
        break;
    default:
        infoFunction();
}