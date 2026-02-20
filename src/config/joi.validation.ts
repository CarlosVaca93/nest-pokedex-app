import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
    MONGO_DB: Joi.required(),
    DEFAULT_LIMIT: Joi.number().default(6)
})