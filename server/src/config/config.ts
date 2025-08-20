import dotenv from "dotenv";
dotenv.config();

const MONGO_USERNAME:string = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD:string = process.env.MONGO_PASSWORD || '';

const MONGO_URL: string = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.i6679dv.mongodb.net/elearningdb?retryWrites=true&w=majority&appName=Cluster0`;


const PORT:number = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT): 8000;
const ROUNDS:number = process.env.SERVER_ROUNDS ? Number(process.env.SERVER_ROUNDS) : 10;

export const config = {
  mongo: {
    url: MONGO_URL,
  },
  server: {
    port: PORT,
  },
//   jwt: {
//     secret: process.env.JWT_SECRET,
//   },
};
