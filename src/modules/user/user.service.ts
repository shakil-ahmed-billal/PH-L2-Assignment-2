import { pool } from "../../config/db";

const getAllUsers = async () => {
  const result = await pool.query(`
      SELECT id, name, email, phone, role FROM users;
  `);
  return result.rows;
};

const updateUser = async (userId: string, payload: Record<string, unknown>) => {
  const { name, email, phone, role } = payload;
  const result = await pool.query(
    `
      UPDATE users
      SET name = $1, email = $2, phone = $3, role = $4
      WHERE id = $5
      RETURNING *;
  `,
    [name, email, phone, role, userId]
  );
  return result.rows[0];
};

const deleteUser = async (userId: string) => {
  const result = await pool.query(
    `
      DELETE FROM users WHERE id = $1 RETURNING *;
  `,
    [userId]
  );
  return result.rows[0];
};

export const userService = {
  getAllUsers,
  updateUser,
  deleteUser,
};
