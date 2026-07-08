import { DatabaseService } from "../../config/db";
import { PrismaService } from "../../lib/prisma";

export class UserService {
  constructor(
    private prismaService: PrismaService,
    private dbService: DatabaseService
  ) {

  }

  /*
  // RAW PG POOL METHOD:
  async getUserById(id: Number) {
    const emp = await this.dbService.pool.query(
      `
      SELECT * FROM employees WHERE id = $1
      `,
      [id]
    )
    return emp.rows[0] ?? null;
  }
  */
  // PRISMA ORM METHOD:
  async getUserById(id: number) {
    return this.prismaService.client.user.findUnique({
      where: { id },
    });
  }

  /*
  // RAW PG POOL METHOD:
  async getUsers() {
    // throw new Error('test err!')

    const emps = await this.dbService.pool.query(
      `
      SELECT * FROM employees
      `,
    )
    return emps.rows
    // return [{ id: 1, name: 'Shashi' }];
  }
  */
  // PRISMA ORM METHOD:
  async getUsers() {
    return this.prismaService.client.user.findMany();
  }

  /*
  // RAW PG POOL METHOD:
  async updateUserById(id: number, name: string) {
    const emp = await this.dbService.pool.query(
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
  */
  // PRISMA ORM METHOD:
  async updateUserById(id: number, name: string) {
    return this.prismaService.client.user.update({
      where: { id },
      data: {
        name,
        email: `${name.toLowerCase().replace(/\s+/g, "")}@email.com`,
      },
    });
  }

  /*
  // RAW PG POOL METHOD:
  async createUser(data: { name: string }) {
    const emp = await this.dbService.pool.query(
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
  */
  // PRISMA ORM METHOD:
  async createUser(data: { name: string }) {
    return this.prismaService.client.user.create({
      data: {
        name: data.name,
        email: `${data.name.toLowerCase().replace(/\s+/g, "")}-${Date.now()}@email.com`,
      },
    });
  }

  /*
  // RAW PG POOL METHOD:
  async deleteUserById (id: number) {
    const response = await this.dbService.pool.query(
      `
      DELETE FROM employees
      WHERE id = $1
      `,
      [id]
    )
    const count: number = response?.rowCount ?? 0
    return { msg: count > 0 ? 'Done' : 'Not Found' }; 
  }
  */
  // PRISMA ORM METHOD:
  async deleteUserById(id: number) {
    try {
      await this.prismaService.client.user.delete({
        where: { id },
      });
      return { msg: "Done" };
    } catch (error) {
      return { msg: "Not Found" };
    }
  }
}