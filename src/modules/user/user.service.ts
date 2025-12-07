import { pool } from "../../config/db";

const getAllUsers = async () => {
  const result = await pool.query(`
      SELECT id, name, email, phone, role FROM users;
  `);
  return result.rows;
};

const updateUser = async (
  userId: string,
  payload: Record<string, unknown>,
  authUser: any
) => {
  const { name, email, phone, role } = payload;
  console.log(authUser, payload, userId);

  if (authUser.role == "admin" || authUser.id == userId) {
    try {
      const emailCheck = await pool.query(
        `SELECT * FROM users WHERE email = $1 AND id != $2`,
        [email, userId]
      );

      if (emailCheck.rows.length > 0) {
        throw new Error("The email is already in use by another user.");
      }

      const updatedRole = authUser.role === "admin" ? role : authUser.role;

      // Update the user in the database
      const result = await pool.query(
        `
          UPDATE users
          SET name = $1, email = $2, phone = $3, role = $4
          WHERE id = $5
          RETURNING *;
        `,
        [name, email, phone, updatedRole, userId]
      );

      if (result.rowCount === 0) {
        throw new Error("User not found or no changes made.");
      }

      return result.rows[0];
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  } else {
    throw new Error(
      "Unauthorized action. Customers can only update their own profile."
    );
  }
};

const deleteUser = async (userId: string) => {
  // Delete user (only if no active bookings exist)

  const findBooking = await pool.query(
    `
        SELECT * FROM bookings WHERE customer_id = $1;
    `,
    [userId]
  );

  console.log(findBooking);
  if ((findBooking.rowCount as any) > 0) {
    throw new Error("Cannot delete user with active bookings");
  }

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
