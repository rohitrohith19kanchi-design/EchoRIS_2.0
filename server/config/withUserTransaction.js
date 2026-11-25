import pool from "./db.js";

const withUserTransaction = async (userId, callback) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(
      "SELECT set_config('app.user_id', $1, true)",
      [userId]
    );

    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export default withUserTransaction;
