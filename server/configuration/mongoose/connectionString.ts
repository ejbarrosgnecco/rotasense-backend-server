import "dotenv/config"

const MONGO_CONNECTION_STRING = `mongodb+srv://ejbarrosgnecco:${process.env.MONGODB_PASS}@rotasense.g7cm347.mongodb.net/?retryWrites=true&w=majority`;

export default MONGO_CONNECTION_STRING