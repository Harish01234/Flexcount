import {app} from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/dbconnect.js";
import { addExercise } from "./controllers/exercises.controllers.js";

dotenv.config();


app.on("error", (err) => console.log("express instance error",err));

// app.post("/exercises/add", addExercise)

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, () => console.log(`Server running on port ${process.env.PORT || 8000}`));
})
.catch((err) => console.log("database connection error",err));

