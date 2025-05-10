import express from "express"
import cors from "cors"
import { clerkMiddleware } from '@clerk/express'

const app = express();
app.use(cors());
app.use(express.json({limit: "32kb"}));
app.use(express.urlencoded({extended: true, limit: "32kb"}));
app.use(express.static("public"));
app.use(clerkMiddleware());


//import routes
import exercisesRoute from "./routes/exercises.route.js";

app.use("/api/v1/exercises", exercisesRoute);




export { app };