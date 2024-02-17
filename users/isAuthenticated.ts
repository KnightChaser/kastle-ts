import express from "express";
import jwtTokenService from "./jsonwebtoken";

// Return true if the user is authenticated
function isAuthenticated(request: express.Request, response: express.Response) {
    try {
        const token = request.headers.authorization?.split(" ")[1];
        jwtTokenService.getPayload(token || "");
        return true;
    } catch(error) {
        return false;
    }
}

export default isAuthenticated;