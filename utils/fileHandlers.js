const fs = require('fs');
const path = require('path'); // Import path for file path handling

const filePath = path.join(__dirname, '../data/tasks.json'); // Use path for cross-OS compatibility

// Function to write tasks to file
exports.writeTasksToFile = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2)); // Corrected typo in `writeFileSync`
};

// Function to read tasks from file
exports.readTasksFromFile = () => {
    if (!fs.existsSync(filePath)) {
        exports.writeTasksToFile([]); 
        return [];
    }
    const data = fs.readFileSync(filePath); // Reads file content
    return JSON.parse(data); // Parse JSON data
};
