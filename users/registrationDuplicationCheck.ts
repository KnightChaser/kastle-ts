// registrationDuplicationCheck.ts
import { ResultSetHeader, RowDataPacket } from "mysql2";
import dbSession from "../db/dbconnection";
import Express from "express";

const registrationDuplicationCheck = async (request: Express.Request, response: Express.Response) => {
    const { username, email } = request.body;
    const dbConnection = await dbSession.getConnection();

    try {
        const sqlPreparedStatement = `SELECT * FROM ${process.env.MYSQL_USER_TABLE_NAME} WHERE username = ? OR email = ?`;
        const sqlPreparedStatementValues = [username, email];

        const [rows, _] = await dbConnection.query<RowDataPacket[]>(sqlPreparedStatement, sqlPreparedStatementValues);

        if (rows.length > 0) {
            // User already exists
            return { status: 400, message: "Username or email already exists" };
        } else {
            // User is unique
            return { status: 200, message: "Username and email are unique" };
        }
    } catch (error) {
        console.error(`Error occurred while checking for duplication: ${error}`);
        throw { status: 500, message: "Internal server error" };
    } finally {
        dbConnection.release();
    }
};

export default registrationDuplicationCheck;
