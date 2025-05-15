import dotenv from "dotenv"
import path from "path"

dotenv.config();

// Then load root .env as fallback (lancerflow/.env)
dotenv.config({
    path: path.resolve(__dirname, '../../../.env'),
});

console.log("Loaded PRIMARY_BACKEND_URL:", process.env.PRIMARY_BACKEND_URL);
console.log("Loaded RESEND_API:", process.env.RESEND_API_KEY);