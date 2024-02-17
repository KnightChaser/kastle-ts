// registration.ts
import { ResultSetHeader, RowDataPacket } from "mysql2";
import dbSession from "../db/dbconnection";
import Express from "express";
import bcrypt from "bcryptjs";

const registration = async(request: Express.Request, response: Express.Response) => {
    const { username, password, email } = request.body;
    const dbConnection = await dbSession.getConnection();

    // Hash the password
    const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_COUNT));
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const sqlPreparedStatement = `INSERT INTO ${process.env.MYSQL_USER_TABLE_NAME} (username, password, email) VALUES (?, ?, ?)`;
        const sqlPreparedStatementValues = [username, hashedPassword, email];
        const [rows, _] = await dbConnection.query<ResultSetHeader>(sqlPreparedStatement, sqlPreparedStatementValues);

        if (rows) {
            return { status: 201, message: "User registered successfully" };
        } else {
            return { status: 500, message: "Internal server error" };
        }
    } catch (error) {
        console.error(`Error occurred while registering a user: ${error}`);
        return { status: 500, message: "Internal server error" };
    } finally {
        dbConnection.release();
    }
};

export default registration;