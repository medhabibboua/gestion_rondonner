const fs=require('fs')

const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const Place = require("../models/place");
const User = require("../models/user");

const getCoordsForAddress = require("../util/location");
const user = require("../models/user");

exports.getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
    if (!place) {
      const error = new Error("no places found");
      error.statusCode = 500;
      return next(error);
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

exports.getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  let userPlaces;
  try {
    userPlaces = await Place.find({ creator: userId });
    if (!userPlaces) {
      const error = new Error("no place for users found");
      error.statusCode = 500;
      return next(error);
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
  res.status(200).json({
    places: userPlaces.map((place) => place.toObject({ getters: true })),
  });
};

exports.createPlace = async (req, res, next) => {
  const { title, description, adress, creator } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(adress);
  } catch (err) {
    next(err);
  }
  
  const newPlace = new Place({
    title,
    description,
    image:req.file.path,
    location: coordinates,
    adress,
    creator,
  });
  let createdPlace;
  try {
    createdPlace = await newPlace.save();
    let userToAddPlace;
    try {
      userToAddPlace = await user.findById(creator);
      if (!userToAddPlace) {
        const error = new Error("there's no user !!");
        error.statusCode = 401;
        return next(error);
      }
      const session =await mongoose.startSession();
      session.startTransaction();
      await createdPlace.save({ session });
      userToAddPlace.places.push(createdPlace);
      await userToAddPlace.save();
      session.commitTransaction();
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return next(err);
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
  res.status(201).json({ place: createdPlace.toObject({ getters: true }) });
};

exports.updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("validation error");
    error.status(500);
    return next(error);
  }
  const placeId = req.params.placeId;
  const { title, description } = req.body;
  let placeToUpdate;
  let updatedPlace;
  try {
    placeToUpdate = await Place.findById(placeId);
    if (!placeToUpdate) {
      const error = new Error("no place to Update");
      error.statusCode = 500;
      return next(error);
    }
    placeToUpdate.title = title;
    placeToUpdate.description = description;
    updatedPlace = await placeToUpdate.save();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }

  res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
};

exports.deletePlace = async (req, res, next) => {
  const placeId = req.params.placeId;
  let placeToDelete;
  let placeImagePath
  
  try {
  placeToDelete=await Place.findById(placeId).populate('creator')
    if(!placeToDelete){
      const error =new Error("can't find a place to delete")
      error.statusCode=500
      return next(err)
    }
     placeImagePath=placeToDelete.image
    const session=await mongoose.startSession()
    session.startTransaction()
    await placeToDelete.remove({session})
    placeToDelete.creator.places.pull(placeToDelete)
    await placeToDelete.creator.save();
    session.commitTransaction(); 
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
  fs.unlink(placeImagePath,(err)=>{
    console.log(err)
  })
  res.status(200).json({message:"place deleted successfully"});
};
