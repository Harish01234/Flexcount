import { Router } from "express";
import { addExercise,deleteExercise ,getExercisesByUser,getExercisesByUserAndDay,updateExercise} from "../controllers/exercises.controllers.js";
import { addset, deleteset, updateset } from "../controllers/reps.controllers.js";
import authmiddleware from "../middlewares/authmiddleware.js";

const router = Router();

router.route("/test").get((req, res) => {
    res.json({ message: "Route working!" });
  });
  
//routes for exercises
router.route("/:userId/add").post(addExercise)

router.route("/:userId/delete/:id").delete(deleteExercise)

router.route("/:userId/update/:id").put(updateExercise)

router.route("/getallbyuser/:userId").get(getExercisesByUser);
router.route("/getallbyuserandday/:userId/:day").get(getExercisesByUserAndDay)

//routes for sets

router.route("/:userId/addset/:id").post(authmiddleware,addset)

router.route("/userId/deleteset/:id/set/:setId").delete(authmiddleware,deleteset)

router.route("/userId/updateset/:id/set/:setId").put(authmiddleware,updateset)


export default router