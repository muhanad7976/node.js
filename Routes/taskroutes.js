const { createTasks, getTasks, updateTasks, deleteTasks } = require("../Controlles/taskControlles");

const taskRoutes = (req, res) => {
    if (req.method === 'GET') {
        getTasks(req, res); // Handles GET requests to fetch tasks
    } else if (req.method === 'POST') {
        createTasks(req, res); // Handles POST requests to create a new task
    } else if (req.method === 'PATCH') {
        updateTasks(req, res); // Handles PATCH requests to update a task
    } else if (req.method === 'DELETE') {
        deleteTasks(req, res); // Handles DELETE requests to remove a task
    } else {
        res.writeHead(404, 'Data Not Found', { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Unknown Method required' }));
    }
};

module.exports = taskRoutes;
