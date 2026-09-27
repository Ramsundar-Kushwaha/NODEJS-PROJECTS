// Requiring module
const fs = require('fs');

// Accessing arguments
const args = process.argv;

// The "app.js" is 6 character long
// so -6 removes last 8 characters
const currentWorkingDirectory = args[1].slice(0, -6);


// for debuging
// console.log(args);
// console.log(currentWorkingDirectory);

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
    console.log(fileData);

    // Split the string and store into array
    data = fileData.split('\n');
    console.log(data);

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

// Handels command
switch (args[2]){
    case 'ls':
        listFunction();
        break;
    case 'add':
        addFunction();
        break;
    default:
        console.log("This is default case!");
}