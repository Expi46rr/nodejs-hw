import { Joi, Segments } from "celebrate";
import { isValidObjectId } from "mongoose";

export const createNoteSchema = {
   [Segments.BODY]:Joi.object({
    title: Joi.string().required().min(1),
    content: Joi.string(),
    tag: Joi.string().valid("Work","Personal","Meeting","Shopping","Ideas","Travel","Finance","Health","Important","Todo",),
  })
};

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string().valid("Work", "Personal", "Meeting", "Shopping", "Ideas", "Travel", "Finance", "Health", "Important", "Todo",),
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
    content: Joi.string(),
    tag: Joi.string().valid("Work","Personal","Meeting","Shopping","Ideas","Travel","Finance","Health","Important","Todo",),
  }).min(1),
  [Segments.PARAMS]:Joi.object({
     noteId: Joi.string().custom(objIdValidator).required()
  })
};
