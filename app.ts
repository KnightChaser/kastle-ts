import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import dbSession from "./db/dbconnection";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import the dbSession from db/dbconnection.ts
app.get("/", (request, response) => {
  response.send("Hello World");
});

// Import the dbSession from db/dbconnection.ts
app.listen(process.env.SERVER_ACCESS_PORT, () => {
    console.log(`Server is running on port ${process.env.SERVER_ACCESS_PORT}`);
});


// Register a new user to the database
app.post("/register", async (request: express.Request, response: express.Response) => {
    try {
        const { username, password, email } = request.body;
        
        // Check if the user already exists
        if (!username || !password || !email) {
            return response.status(400).send("Either username, password or email is missing(or more)");
        }

        // Hash the password
        const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_COUNT));
        const hashedPassword = await bcrypt.hash(password, salt);

        const dbConnection = await dbSession.getConnection();
        let sqlPreparedStatement = `INSERT INTO ${process.env.MYSQL_USER_TABLE_NAME} (username, password, email) VALUES (?, ?, ?)`;
        let sqlPreparedStatementValues = [username, hashedPassword, email];
        const rows = await dbConnection.query(sqlPreparedStatement, sqlPreparedStatementValues);
        dbConnection.release();

        if (rows) {
            return response.status(201).send("User registered successfully");
        } else {
            throw new Error(`Error occurred while registering a user: ${rows}`)
        }
        
    } catch(error) {
        console.error(`Error occurred while registering a user: ${error}`);
        response.status(500).send("Internal server error"); // Send the error message to the client
    }
});
