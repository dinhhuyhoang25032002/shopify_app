import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const SECRET_KEY = process.env.SHOPIFY_API_SECRET || "super-secret-key";

export function generateToken() {
    const payload = {
        "iss": "https://strategic-negotiation-app.myshopify.com/admin",
        "dest": "https://strategic-negotiation-app.myshopify.com",
        "aud": "1a28349fe7659977acfb7bd2dc4daf77",
        "sub": "120682643703",
        "jti": "9ccaa65e-5f4c-4b30-8272-adc9b710f53e",
        "sid": "04890043-bdf6-47f6-bc35-90239d7f455c",
        "sig": "459652c368aa5a52056912aa69152bc5ae5d6ae992d03b69d41bedaaa7d2994d"
    }
    return jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });
}
