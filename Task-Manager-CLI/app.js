const fs = require("fs");
const yargs = require("yargs/yargs");
const parser = yargs(process.argv.slice(2));


const taskFile = 'tasks.json';

// Helper function to read tasks from the file
const readTask = () => {
    try{
        const dataBuffer = fs.readFileSync(taskFile);
        const dataJson = dataBuffer.toString();
        return JSON.parse(dataJson);
    }
    catch(error){
        console.log("line 15: error while reading the task file\n");
        return [];
    }
};

// Helper function to save task to the file
const saveTask = (task) =>{
    const dataJson = JSON.stringify(task, null, 2);
    fs.writeFileSync(taskFile,  dataJson);
};


// Command to add a task
parser.command({
    command: "add", // command
    describe: 'Add a new task',
    builder: { // option command
        description: {
            describe: 'Task description',
            demandOption: true, // option commadn mandatory
            type: 'string'
        }
    },
    handler(argv){
        const tasks = readTask();
        const newTask = {
            id: tasks.length + 1,
            description: argv.description,
            completed: false
        };
        tasks.push(newTask);
        saveTask(tasks);
        console.log(`Task "${argv.description}" added successfully!`);
    }
});

// Command to list all tasks
parser.command({
    command: 'list',
    describe: 'List all tasks',
    handler() {
        const tasks = readTask();
        if(tasks.length === 0){
            console.log("No tasks available");
        }else{
            console.log('Task List:');
            tasks.forEach(task => {
                console.log(`${task.id}. ${task.description} - ${task.completed ? 'Completed' : 'Not Completed'}`);
            });
        }
    }
});

// Command to mark a task completed
parser.command({
    command: 'complete',
    describe: 'Mark a task complete',
    builder: {
        id: {
            describe: 'Task ID to mark as completed',
            demandOption: true,
            type: 'number'
        }
    },
    handler(argv){
        const tasks = readTask();
        const task = tasks.find((task) => task.id === argv.id);
        if (!task) {
            console.log('Task not found!\n');
            return;
        }
        task.completed = true;
        saveTask(tasks);
        console.log(`Task ${argv.id} marked as completed!\n`);
    }
});

// command to remove a task
parser.command({
    command: 'remove',
    describe: 'Remove a task',
    builder: {
        id : {
            describe: 'ID of the task',
            demandOption: true,
            type: 'number'
        }
    },
    handler(argv){
        const tasks = readTask();
        const updateTask = tasks.filter((task) => task.id !== argv.id);
        if(updateTask.length === tasks.length){
            console.log('Task not found!\n');
            return;
        }
        saveTask(updateTask);
        console.log(`Task ${argv.id} removed successfully!`);
    }
});

// Parse command line arguments
parser.parse();