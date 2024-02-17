import jwt from "jsonwebtoken";

const jwtTokenService = {
    // Create a token
    getToken(username: string) {
        return jwt.sign({username}, process.env.JWT_SECRET || "kastle_ts", {
            expiresIn: "1h"}
        )
    },
    
    // Verify the token
    getPayload(token: string) {
        return jwt.verify(token, process.env.JWT_SECRET || "kastle_ts");
    }
}

export default jwtTokenService;