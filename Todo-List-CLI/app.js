const fs = require('fs');
const { type } = require('os');
const { describe, demandOption } = require('yargs');
const yargs = require('yargs/yargs');
const parser = yargs(process.argv.slice(2));

const myList = "todoList.json";

const readList = ()=>{
    try{
        const bufferData = fs.readFileSync(myList);
        const bufferString = bufferData.toString();
        const dataJson = JSON.parse(bufferString);
        return dataJson;
    }
    catch(err){
        return [];
    }
};

const saveList = (task)=>{
    try{
        const taskString = JSON.stringify(task, null, 2);
        fs.writeFileSync(myList, taskString);
    }
    catch(err){
        console.log("File Not Found!\n");
    }
};

// ADD TASK
parser.command({
    command: 'add',
    describe: 'Add list',
    builder:{
        description : {
            describe: 'Task Description',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv){
        const taskList = readList();
        const newList = {
            id: taskList.length + 1,
            description: argv.description,
            status: 'remaining'
        };

        taskList.push(newList);
        saveList(taskList);

        console.log("task added");
    }
});

// LIST ALL TASK
parser.command({
    command: 'ls',
    describe: "list all",
    handler(argv){
        const tasks = readList();
        if(tasks.length == 0){
            console.log("Empty Task List");
            return;
        }

        console.log('Task List');
        tasks.forEach(task => {
            console.log(`ID: ${task.id}\nDescription: ${task.description}\nStatus: ${task.status}\n\n`);
        });
    }
});

// REMOVE TASK
parser.command({
    command: "rm",
    describe: "Remove the task",
    builder: {
        id : {
            describe: "ID of task to remove",
            demandOption: true,
            type: 'number'
        }
    },
    handler(argv){
        const tasks = readList();
        const removeTask = tasks.filter((task)=> task.id !== argv.id);
        if(tasks.length == removeTask.length){
            console.log("Task Not Found!\n");
            return;
        }
        saveList(removeTask);
        console.log(`Task ${argv.id} removed\n`);
    }
});

// MARK DONE
parser.command({
    command: "done",
    describe: "task done",
    builder: { 
        id: {
            describe: " id of the task to remove",
            demandOption: true,
            type: 'number'
        }
    },
    handler(argv){
        const tasks = readList();
        if (tasks.length === 0){
            console.log("Empty List\n");
            return;
        }
    }
});

parser.parse();