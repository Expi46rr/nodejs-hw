import { Joi, Segments } from "celebrate";
import { isValidObjectId } from "mongoose";
import { TAGS } from "../constants/tags.js";

export const createNoteSchema = {
   [Segments.BODY]:Joi.object({
    title: Joi.string().required().min(1),
    content: Joi.string().allow(""),
    tag: Joi.string().valid(TAGS),
  })
};

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string().valid(TAGS),
    search: Joi.string().trim().allow(""),
 })
};

const objIdValidator = (value, helpers) => {
  if (isValidObjectId(value)) {
    return value;
  }
 return helpers.message("ID is not valid");
 };
export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
     noteId: Joi.string().custom(objIdValidator).required()

  })
};

export const updateNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1),
    content: Joi.string().allow(""),
    tag: Joi.string().valid(...TAGS),
  }).min(1),
  [Segments.PARAMS]:Joi.object({
     noteId: Joi.string().custom(objIdValidator).required()
  })
};
