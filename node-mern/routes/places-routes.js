const express = require("express");
const { check } = require("express-validator");

const placesController = require("../controllers/placesController");
const fileUpload=require('../middleware/file-upload')
const checkAuth=require('../middleware/check-auth')

const router = express.Router();

router.get(
  "/:pid",
  placesController.getPlaceById
);


router.get("/user/:userId", placesController.getPlacesByUserId);

router.post("/",fileUpload.single('image'), placesController.createPlace);

router.use(checkAuth)

router.patch("/:placeId",
[
  check("title").not().isEmpty(),
  check("description").isLength({ min: 5 })
], placesController.updatePlace);

router.delete("/:placeId", placesController.deletePlace);

module.exports = router;
