
import withUserTransaction from "../config/withUserTransaction.js";

const isValidUUID = (id) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const normalizePeople = (people) => {
  if (!Array.isArray(people)) return [];

  return [
    ...new Set(
      people
        .filter((person) => typeof person === "string")
        .map((person) => person.trim())
        .filter(Boolean)
    ),
  ].slice(0, 30);
};

const findOrCreate = async (client, table, userId, name) => {
  const existing = await client.query(
    `SELECT id FROM ${table}
     WHERE user_id = $1 AND LOWER(name) = LOWER($2)
     LIMIT 1`,
    [userId, name]
  );

  if (existing.rows.length) return existing.rows[0].id;

  const created = await client.query(
    `INSERT INTO ${table} (user_id, name)
     VALUES ($1, $2)
     RETURNING id`,
    [userId, name]
  );

  return created.rows[0].id;
};

const getMemoryQuery = `
  SELECT
    m.id,
    m.title,
    m.content,
    m.memory_date,
    m.visibility,
    m.created_at,
    m.updated_at,

    COALESCE(
      (
        SELECT json_agg(p.name ORDER BY p.name)
        FROM memory_people mp
        JOIN people p ON p.id = mp.person_id
        WHERE mp.memory_id = m.id
      ),
      '[]'::json
    ) AS people,

    (
      SELECT pl.name
      FROM memory_places mpl
      JOIN places pl ON pl.id = mpl.place_id
      WHERE mpl.memory_id = m.id
      ORDER BY pl.name
      LIMIT 1
    ) AS place,

    (
      SELECT t.name
      FROM memory_tags mt
      JOIN tags t ON t.id = mt.tag_id
      WHERE mt.memory_id = m.id
      ORDER BY t.name
      LIMIT 1
    ) AS emotion

  FROM memories m
`;

// GET all active memories
export const getMemories = async (req, res) => {
  try {
    const result = await withUserTransaction(req.user.id, (client) =>
      client.query(
        `${getMemoryQuery}
         WHERE m.user_id = $1
         AND m.deleted_at IS NULL
         ORDER BY m.memory_date DESC NULLS LAST`,
        [req.user.id]
      )
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get memories error:", error.message);
    res.status(500).json({
      message: "Could not retrieve memories.",
    });
  }
};

// GET one memory
export const getMemoryById = async (req, res) => {
  try {
    if (!isValidUUID(req.params.id)) {
      return res.status(400).json({
        message: "Invalid memory ID.",
      });
    }

    const result = await withUserTransaction(req.user.id, (client) =>
      client.query(
        `${getMemoryQuery}
         WHERE m.id = $1
         AND m.user_id = $2
         AND m.deleted_at IS NULL`,
        [req.params.id, req.user.id]
      )
    );

    if (!result.rows.length) {
      return res.status(404).json({
        message: "Memory not found.",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get memory error:", error.message);
    res.status(500).json({
      message: "Could not retrieve memory.",
    });
  }
};

// POST create memory with relationships
export const createMemory = async (req, res) => {
  try {
    const {
      title,
      content,
      memory_date,
      visibility = "private",
      people = [],
      place = "",
      emotion = "",
    } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      title.trim().length > 200 ||
      typeof content !== "string" ||
      content.length > 20000
    ) {
      return res.status(400).json({
        message: "A valid title and content are required.",
      });
    }

    if (!["private", "public"].includes(visibility)) {
      return res.status(400).json({
        message: "Invalid visibility setting.",
      });
    }

    if (
      (memory_date !== undefined &&
        memory_date !== null &&
        (typeof memory_date !== "string" ||
          !/^\d{4}-\d{2}-\d{2}$/.test(memory_date))) ||
      (place && typeof place !== "string") ||
      (emotion && typeof emotion !== "string") ||
      !Array.isArray(people)
    ) {
      return res.status(400).json({
        message: "Invalid memory details.",
      });
    }

    const normalizedPeople = normalizePeople(people);
    const normalizedPlace =
      typeof place === "string" ? place.trim() : "";
    const normalizedEmotion =
      typeof emotion === "string" ? emotion.trim() : "";

    const memory = await withUserTransaction(
      req.user.id,
      async (client) => {
        const inserted = await client.query(
          `INSERT INTO memories
           (user_id, title, content, memory_date, visibility)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id`,
          [
            req.user.id,
            title.trim(),
            content,
            memory_date || null,
            visibility,
          ]
        );

        const memoryId = inserted.rows[0].id;

        for (const personName of normalizedPeople) {
          const personId = await findOrCreate(
            client,
            "people",
            req.user.id,
            personName
          );

          await client.query(
            `INSERT INTO memory_people (memory_id, person_id)
             VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [memoryId, personId]
          );
        }

        if (normalizedPlace) {
          const placeId = await findOrCreate(
            client,
            "places",
            req.user.id,
            normalizedPlace
          );

          await client.query(
            `INSERT INTO memory_places (memory_id, place_id)
             VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [memoryId, placeId]
          );
        }

        if (normalizedEmotion) {
          const tagId = await findOrCreate(
            client,
            "tags",
            req.user.id,
            normalizedEmotion
          );

          await client.query(
            `INSERT INTO memory_tags (memory_id, tag_id)
             VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [memoryId, tagId]
          );
        }

        const result = await client.query(
          `${getMemoryQuery}
           WHERE m.id = $1
           AND m.user_id = $2`,
          [memoryId, req.user.id]
        );

        return result.rows[0];
      }
    );

    res.status(201).json(memory);
  } catch (error) {
    console.error("Create memory error:", error.message);
    res.status(500).json({
      message: "Could not create memory.",
    });
  }
};

// PATCH update core memory details
export const updateMemory = async (req, res) => {
  try {
    if (!isValidUUID(req.params.id)) {
      return res.status(400).json({
        message: "Invalid memory ID.",
      });
    }

    const { title, content, memory_date, visibility } = req.body;

    if (
      (title !== undefined &&
        (typeof title !== "string" || !title.trim() || title.length > 200)) ||
      (content !== undefined &&
        (typeof content !== "string" || content.length > 20000)) ||
      (memory_date !== undefined &&
        memory_date !== null &&
        (typeof memory_date !== "string" ||
          !/^\d{4}-\d{2}-\d{2}$/.test(memory_date))) ||
      (visibility !== undefined &&
        !["private", "public"].includes(visibility))
    ) {
      return res.status(400).json({
        message: "Invalid memory data.",
      });
    }

    const result = await withUserTransaction(req.user.id, (client) =>
      client.query(
        `UPDATE memories
         SET title = COALESCE($1, title),
             content = COALESCE($2, content),
             memory_date = COALESCE($3, memory_date),
             visibility = COALESCE($4, visibility),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $5
         AND user_id = $6
         AND deleted_at IS NULL
         RETURNING *`,
        [
          title !== undefined ? title.trim() : null,
          content ?? null,
          memory_date ?? null,
          visibility ?? null,
          req.params.id,
          req.user.id,
        ]
      )
    );

    if (!result.rows.length) {
      return res.status(404).json({
        message: "Memory not found.",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update memory error:", error.message);
    res.status(500).json({
      message: "Could not update memory.",
    });
  }
};

// DELETE: soft archive
export const deleteMemory = async (req, res) => {
  try {
    if (!isValidUUID(req.params.id)) {
      return res.status(400).json({
        message: "Invalid memory ID.",
      });
    }

    const result = await withUserTransaction(req.user.id, (client) =>
      client.query(
        `UPDATE memories
         SET deleted_at = CURRENT_TIMESTAMP,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         AND user_id = $2
         AND deleted_at IS NULL
         RETURNING id`,
        [req.params.id, req.user.id]
      )
    );

    if (!result.rows.length) {
      return res.status(404).json({
        message: "Memory not found.",
      });
    }

    res.json({
      message: "Memory archived successfully.",
    });
  } catch (error) {
    console.error("Archive memory error:", error.message);
    res.status(500).json({
      message: "Could not archive memory.",
    });
  }
};
