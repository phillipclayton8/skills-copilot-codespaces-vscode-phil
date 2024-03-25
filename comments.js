// Create web server
// npm install express
// npm install body-parser

const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');

const app = express();
app.use(bodyParser.json());

// Create a database to store comments
const commentsByPostId = {};

// Get all comments for a specific post
app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

// Add a comment to a specific post
app.post('/posts/:id/comments', (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  // Get comments for the specific post
  const comments = commentsByPostId[req.params.id] || [];

  // Add a new comment
  comments.push({ id: commentId, content });

  // Update the comments
  commentsByPostId[req.params.id] = comments;

  // Send back the new comment
  res.status(201).send(comments);
});

app.listen(4001, () => {
  console.log('Listening on 4001');
});

// Run with: node comments.js

// Test with:
// curl -X POST localhost:4001/posts/123/comments -d '{"content": "Great post!"}' -H 'Content-Type: application/json'
// curl localhost:4001/posts/123/comments

// Path: query.js
// Create a query service
// npm install express
// npm install axios

const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Create a database to store posts
const posts = {};

// Handle events
const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId } = data;
    const post = posts[postId];
    post.comments.push({ id, content });
  }

  console.log(posts);
};

// Get all posts
app.get('/posts', (req, res) => {
  res.send(posts);
});

// Receive events
app.post('/events', (req, res) => {