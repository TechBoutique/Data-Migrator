import { Router } from "express";
import { uploadcsv, upload, home } from "../controllers/csv.controller";

const router = Router();
router.route("/")  
    .get(home)

router.route("/csv")
    .post(upload.single("document"), uploadcsv)
    
    
export default router;
