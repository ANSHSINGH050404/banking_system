import express from "express";
import connectDB from "./config/db";
import Authrouter from "./routers/auth.router";
import morgan from "morgan";
const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/api/v1/', Authrouter)

const port = process.env.PORT || 5000;


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});