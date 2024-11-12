import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

// MySQL database connection
const db = mysql.createConnection({
  host: '34.134.85.107',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'smartsched'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});

// Endpoint to get all buckets with their todos
app.get('/buckets', (req, res) => {
  const query = `
    SELECT 
      b.id AS bucket_id,
      b.name AS bucket_name,
      b.description AS bucket_description,
      t.id AS todo_id,
      t.title AS todo_title,
      t.description AS todo_description,
      t.deadline AS todo_deadline,
      t.done AS todo_done
    FROM buckets b
    LEFT JOIN todo_lists t ON b.id = t.bucket_id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const buckets = results.reduce((acc, row) => {
      const { bucket_id, bucket_name, bucket_description, todo_id, todo_title, todo_description, todo_deadline, todo_done } = row;

      let bucket = acc.find(b => b.id === bucket_id);
      if (!bucket) {
        bucket = {
          id: bucket_id,
          name: bucket_name,
          description: bucket_description,
          todo_lists: []
        };
        acc.push(bucket);
      }

      if (todo_id) {
        bucket.todo_lists.push({
          id: String(todo_id),
          title: todo_title,
          description: todo_description,
          deadline: todo_deadline,
          done: todo_done
        });
      }

      return acc;
    }, []);

    res.json(buckets);
  });
});

// Endpoint to get a specific bucket by bucket_id with its todos
app.get('/buckets/:bucket_id', (req, res) => {
  const { bucket_id } = req.params;

  const query = `
    SELECT 
      b.id AS bucket_id,
      b.name AS bucket_name,
      b.description AS bucket_description,
      t.id AS todo_id,
      t.title AS todo_title,
      t.description AS todo_description,
      t.deadline AS todo_deadline,
      t.done AS todo_done
    FROM buckets b
    LEFT JOIN todo_lists t ON b.id = t.bucket_id
    WHERE b.id = ?;
  `;

  db.query(query, [bucket_id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: `Bucket with id ${bucket_id} not found` });
      return;
    }

    const bucket = {
      id: results[0].bucket_id,
      name: results[0].bucket_name,
      description: results[0].bucket_description,
      todo_lists: []
    };

    results.forEach(row => {
      if (row.todo_id) {
        bucket.todo_lists.push({
          id: row.todo_id,
          title: row.todo_title,
          description: row.todo_description,
          deadline: row.todo_deadline,
          done: row.todo_done
        });
      }
    });

    res.json(bucket);
  });
});

// Endpoint to create a new bucket
app.post('/buckets', (req, res) => {
  const { name, description } = req.body;
  const query = 'INSERT INTO buckets (name, description) VALUES (?, ?)';
  db.query(query, [name, description], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: results.insertId, name, description });
  });
});

// Endpoint to add a todo to a specific bucket
app.post('/buckets/:bucketId/todos', (req, res) => {
  const { bucketId } = req.params;
  const { title, description, deadline, done } = req.body;
  const query = 'INSERT INTO todo_lists (bucket_id, title, description, deadline, done) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [bucketId, title, description, deadline, done], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: results.insertId, title, description, deadline, done });
  });
});

// Endpoint to update a bucket
app.patch('/buckets/:bucketId', (req, res) => {
  const { bucketId } = req.params;
  const { name, description } = req.body;
  const query = 'UPDATE buckets SET name = ?, description = ? WHERE id = ?';
  db.query(query, [name, description, bucketId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Bucket updated successfully' });
  });
});

// Endpoint to delete a bucket
app.delete('/buckets/:bucketId', (req, res) => {
  const { bucketId } = req.params;
  const query = 'DELETE FROM buckets WHERE id = ?';
  db.query(query, [bucketId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Bucket deleted successfully' });
  });
});

// Endpoint to update a todo item in a specific bucket
app.patch('/buckets/:bucketId/todos/:todoId', (req, res) => {
  const { bucketId, todoId } = req.params;
  const { title, description, deadline, done } = req.body;

  const query = `
    UPDATE todo_lists
    SET title = ?, description = ?, deadline = ?, done = ?
    WHERE id = ? AND bucket_id = ?;
  `;
  db.query(query, [title, description, deadline, done, todoId, bucketId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Todo updated successfully' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
