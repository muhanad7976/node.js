const { IncomingForm } = require('formidable');
const { readTasksFromFile, writeTasksToFile } = require("../utils/fileHandlers");
const { copyFileSync } = require('fs');
const path = require('path');


// Get all tasks
exports.getTasks = (req, res) => {
    const tasks = readTasksFromFile();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(tasks));
};

// Create a new task
exports.createTasks = (req, res) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                message: 'Error parsing form'
            }));
            return;
        }
        
        const tasks = readTasksFromFile();
        const newTask = {
            id: Date.now(),
            title: fields.title,
            description: fields.description,
            status: fields.status || "pending",
        };

        // Correct variable name here
        const image = files.image ? files.image[0] : null; // Handle cases where no image is uploaded

        if (image) {
            // Assuming you have the logic to copy the image here
            copyFileSync(image.path, path.join(__dirname, '../uploads', image.name));
        }

        tasks.push(newTask);
        writeTasksToFile(tasks);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            message: 'Task created successfully',
            task: newTask
        }));
    });
};


// Update an existing task
exports.updateTasks = (req, res) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Error parsing form' }));
            return;
        }

        const taskId = parseInt(fields.id); // Ensure the ID is provided in the fields
        const tasks = readTasksFromFile();
        const taskIndex = tasks.findIndex(task => task.id === taskId);

        if (taskIndex === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Task not found' }));
            return;
        }

        // Update task fields
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            title: fields.title || tasks[taskIndex].title,
            description: fields.description || tasks[taskIndex].description,
            status: fields.status || tasks[taskIndex].status,
        };

        // If there's a new image, update it
        const image = files.image ? files.image[0] : null;
        if (image) {
            fs.copyFileSync(image.path, path.join(__dirname, '../uploads', image.name));
            tasks[taskIndex].image = `/uploads/${image.name}`;
        }

        writeTasksToFile(tasks);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            message: 'Task updated successfully',
            task: tasks[taskIndex]
        }));
    });
};



exports.deleteTasks = (req, res) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields) => {
        if (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Error parsing form' }));
            return;
        }

        const taskId = parseInt(fields.id);
        let tasks = readTasksFromFile();
        const taskIndex = tasks.findIndex(task => task.id === taskId);

        if (taskIndex === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Task not found' }));
            return;
        }

        // Remove task from array
        const deletedTask = tasks.splice(taskIndex, 1)[0];
        
        writeTasksToFile(tasks);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            message: 'Task deleted successfully',
            task: deletedTask
        }));
    });
};

