import { Pool } from "pg";
import { pool } from "../../config/db";

export class UserService {
  constructor (pool: Pool){
    
  }
  async getUserById(id: Number) {
    const emp = await pool.query(
      `
      SELECT * FROM employees WHERE id = $1
      `,
      [id]
    )
    return emp.rows[0] ?? null;
  }
  
  async getUsers() {
    // throw new Error('test err!')

    const emps = await pool.query(
      `
      SELECT * FROM employees
      `,
    )
    return emps.rows
    // return [{ id: 1, name: 'Shashi' }];
  }

  async updateUserById(id: number, name: string) {
    const emp = await pool.query(
      `
      UPDATE employees
      SET name = $2,
          email = $3
      WHERE id = $1
      RETURNING *
      `,
      [id, name, `${name}@email.com`]
    )

    return emp.rows[0]
  }

  async createUser(data: { name: string }) {
    const emp = await pool.query(
      `
      INSERT INTO employees (name, email)
      VALUES ($1, $2)
      RETURNING *
      `,
      [data.name, `${data.name}@email.com`]
    )
    return emp.rows[0]
    // return { id: Date.now(), ...data };
  }

  async deleteUserById (id: number) {
    const response = await pool.query(
      `
      DELETE FROM employees
      WHERE id = $1
      `,
      [id]
    )
    const count: number = response?.rowCount ?? 0
    return { msg: count > 0 ? 'Done' : 'Not Found' }; 
  }
}