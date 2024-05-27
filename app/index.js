const express = require("express");
const bodyParser = require("body-parser");
const cassandra = require("cassandra-driver");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 3000;

const client = new cassandra.Client({
  contactPoints: ["cassandra"],
  localDataCenter: "datacenter1",
});

app.use(bodyParser.json());

const useKeyspace = `USE steam_forums;`;

// Función para crear el esquema
async function createSchema() {
  const createKeyspace = `
    CREATE KEYSPACE IF NOT EXISTS steam_forums 
    WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 3};
  `;

  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      user_id UUID PRIMARY KEY,
      username text,
      email text,
      created_at timestamp
    );
  `;

  const createForumsTable = `
    CREATE TABLE IF NOT EXISTS forums (
      forum_id UUID PRIMARY KEY,
      forum_name text,
      created_by UUID,
      created_at timestamp
    );
  `;

  const createTopicsTable = `
    CREATE TABLE IF NOT EXISTS topics (
      topic_id UUID,
      forum_id UUID,
      topic_title text,
      created_by UUID,
      created_at timestamp,
      PRIMARY KEY (forum_id, topic_id)
    ) WITH CLUSTERING ORDER BY (topic_id DESC);
  `;

  const createMessagesTable = `
    CREATE TABLE IF NOT EXISTS messages (
      message_id UUID,
      topic_id UUID,
      user_id UUID,
      content text,
      created_at timestamp,
      PRIMARY KEY (topic_id, created_at, message_id)
    ) WITH CLUSTERING ORDER BY (created_at DESC);
  `;

  try {
    await client.connect();
    await client.execute(createKeyspace);
    await client.execute(useKeyspace);
    await client.execute(createUsersTable);
    await client.execute(createForumsTable);
    await client.execute(createTopicsTable);
    await client.execute(createMessagesTable);
    console.log("Schema created successfully.");
  } catch (err) {
    console.error("Error creating schema:", err);
    process.exit(1);
  } finally {
    await client.shutdown();
  }
}

// Llamar a la función de creación del esquema
createSchema();

client.connect().then(() => {
  client.execute(useKeyspace).then(() => {
    console.log("Connected to keyspace.");
  });
});

// Crear usuario
app.post("/users", async (req, res) => {
  const { username, email } = req.body;
  const userId = uuidv4();
  const createdAt = new Date();
  const query =
    "INSERT INTO users (user_id, username, email, created_at) VALUES (?, ?, ?, ?)";
  try {
    await client.execute(query, [userId, username, email, createdAt], {
      prepare: true,
    });
    res.status(201).json({ userId, username, email, createdAt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear foro
app.post("/forums", async (req, res) => {
  const { forumName, createdBy } = req.body;
  const forumId = uuidv4();
  const createdAt = new Date();
  const query =
    "INSERT INTO forums (forum_id, forum_name, created_by, created_at) VALUES (?, ?, ?, ?)";
  try {
    await client.execute(query, [forumId, forumName, createdBy, createdAt], {
      prepare: true,
    });
    res.status(201).json({ forumId, forumName, createdBy, createdAt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear tema
app.post("/topics", async (req, res) => {
  const { forumId, topicTitle, createdBy } = req.body;
  const topicId = uuidv4();
  const createdAt = new Date();
  const query =
    "INSERT INTO topics (topic_id, forum_id, topic_title, created_by, created_at) VALUES (?, ?, ?, ?, ?)";
  try {
    await client.execute(
      query,
      [topicId, forumId, topicTitle, createdBy, createdAt],
      { prepare: true }
    );
    res
      .status(201)
      .json({ topicId, forumId, topicTitle, createdBy, createdAt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Publicar mensaje
app.post("/messages", async (req, res) => {
  const { topicId, userId, content } = req.body;
  const messageId = uuidv4();
  const createdAt = new Date();
  const query =
    "INSERT INTO messages (message_id, topic_id, user_id, content, created_at) VALUES (?, ?, ?, ?, ?)";
  try {
    await client.execute(
      query,
      [messageId, topicId, userId, content, createdAt],
      { prepare: true }
    );
    res.status(201).json({ messageId, topicId, userId, content, createdAt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener mensajes recientes
app.get("/messages/:topicId", async (req, res) => {
  const { topicId } = req.params;
  const limit = parseInt(req.query.limit) || 10;
  const query =
    "SELECT message_id, user_id, content, created_at FROM messages WHERE topic_id = ? ORDER BY created_at DESC LIMIT ?";
  try {
    const result = await client.execute(query, [topicId, limit], {
      prepare: true,
    });
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
