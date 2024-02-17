import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import registrationDuplicationCheck from "./db/users/registrationDuplicationCheck";
import registration from "./db/users/registration";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the views directory
// Because __dirname will be <project_root>/dist, we need to go one directory up
app.use("/views", express.static(path.resolve(__dirname + "/../views")));

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

        // Check if the user already exists
        const accountDuplicationStatus = await registrationDuplicationCheck(request, response);
        if (accountDuplicationStatus.status === 400) {
            // User already exists,,reject the registration
            return response.status(400).send("Username or email already exists");
        }

        // Process the registration normally
        const accountRegistrationStatus = await registration(request, response);
        if (accountRegistrationStatus.status === 201) {
            // User registered successfully
            return response.status(201).send("User registered successfully");
        } else {
            // Internal server error
            return response.status(500).send("Internal server error");
        }
        
    } catch(error) {
        console.error(`Error occurred while registering a user: ${error}`);
        response.status(500).send("Internal server error"); // Send the error message to the client
    }
});

app.get("/register", (request: express.Request, response: express.Response) => {
    response.sendFile(path.resolve(__dirname + "/../views/register/register.html"));
});

app.get("/login", (request: express.Request, response: express.Response) => {
    response.sendFile(path.resolve(__dirname + "/../views/login/login.html"));   
})