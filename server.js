const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Newpass@124',
    database: 'todo'
});

db.connect((err) => {
    if (err) {
        console.error("Error while connecting to the database:", err);
        return;
    }
    console.log("Connected with database successfully!");
});

// Fetch all tasks
app.get('/', (req, res) => {
    db.query('SELECT * FROM todoItems', (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error retrieving data." });
        }
        res.json({
            message: "Tasks retrieved successfully!",
            data: result
        });
    });
});

// Add a new task
app.post('/add-task', (req, res) => {
    const sql = 'INSERT INTO todoItems (itemDescription) VALUES (?)';
    const values = [req.body.text];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error inserting task:", err);
            return res.status(500).send("Failed to add task.");
        }
        console.log("Task inserted:", req.body.text);
        res.send("Task added successfully!");
    });
});

// Edit a task
app.put('/edit-task', (req, res) => {
    const sql = 'UPDATE todoItems SET itemDescription = ? WHERE ID = ?';
    const values = [req.body.itemDescription, req.body.ID];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error updating task:", err);
            return res.status(500).send("Failed to update task.");
        }
        console.log("Task updated:", req.body);
        res.send("Task updated successfully!");
    });
});

// Delete a task
app.delete('/delete-task/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM todoItems WHERE ID = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error deleting task:", err);
            return res.status(500).send("Failed to delete task.");
        }
        console.log(`Task with ID ${id} deleted successfully.`);
        res.send("Task deleted successfully!");
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
