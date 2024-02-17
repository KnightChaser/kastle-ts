// login.ts
// Based on the user information provided from the user, we will try authenticating the user credential.
import { ResultSetHeader } from "mysql2";
import dbSession from "../db/dbconnection";
import Express from "express";
import bcrypt from "bcryptjs";

interface User {
    UserID: number;
    Username: string;
    Email: string;
    Password: string;
}

const login = async(request: Express.Request, response: Express.Response) => {
    const { username, password } = request.body;
    const dbConnection = await dbSession.getConnection();

    try {
        // Because there is an account duplication check, there will be only one user with the same username.
        const sqlPreparedStatement = `SELECT * FROM ${process.env.MYSQL_USER_TABLE_NAME} WHERE username = ?`;
        const sqlPreparedStatementValues = [username];
        const [row, _] = await dbConnection.query<ResultSetHeader>(sqlPreparedStatement, sqlPreparedStatementValues);

        let rowString, user: User;
        try {
            rowString = JSON.stringify(row);
            user = JSON.parse(rowString)[0];       // User information is stored like [{...}], so indexing as [0] is necessary.
        } catch {
            // If the user does not exist, the user will be undefined.
            return { status: 400, message: "Username or password is incorrect" };
        }

        // The database stored user's password as bcrypt.
        const isPasswordMatched = await bcrypt.compare(password, user.Password);
        if (!isPasswordMatched)
            // Password does not match according to the database.
            return { status: 400, message: "Username or password is incorrect" };

        return { status: 200, message: "User logged in successfully" };
    } catch (error) {
        return { status: 500, message: "Internal server error" };
    } finally {
        dbConnection.release();
    }
};

export default login;