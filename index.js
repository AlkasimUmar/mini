const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory store for items
let items = [];
let nextId = 1;

/**
 * Root route
 */
app.get('/', (req, res) => {
  res.send('Hello World');
});

/**
 * Validation middleware for item creation/update
 */
function validateItem(req, res, next) {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required.' });
  }
  next();
}

/**
 * GET /items
 * Get all items
 */
app.get('/items', (req, res) => {
  res.json(items);
});

/**
 * GET /items/:id
 * Get item by ID
 */
app.get('/items/:id', (req, res) => {
  const item = items.find(i => i.id === Number(req.params.id));
  if (!item) {
    return res.status(404).json({ error: 'Item not found.' });
  }
  res.json(item);
});

/**
 * POST /items
 * Create a new item
 */
app.post('/items', validateItem, (req, res) => {
  const { name, description } = req.body;
  const newItem = { id: nextId++, name, description };
  items.push(newItem);
  res.status(201).json(newItem);
});

/**
 * PUT /items/:id
 * Update an item by ID
 */
app.put('/items/:id', validateItem, (req, res) => {
  const item = items.find(i => i.id === Number(req.params.id));
  if (!item) {
    return res.status(404).json({ error: 'Item not found.' });
  }
  item.name = req.body.name;
  item.description = req.body.description;
  res.json(item);
});

/**
 * DELETE /items/:id
 * Delete an item by ID
 */
app.delete('/items/:id', (req, res) => {
  const index = items.findIndex(i => i.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Item not found.' });
  }
  const deletedItem = items.splice(index, 1)[0];
  res.json(deletedItem);
});

/**
 * Catch-all route for unknown paths
 */
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found.' });
});

/**
 * Error handler
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error.' });
});

/**
 * Start the server
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});