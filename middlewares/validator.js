import Joi from "joi";

const validateSignupSchema = Joi.object({
        email : Joi.string().email().min(5).required(),
        password : Joi.string().min(8).required()
});

const validateSigninSchema = Joi.object({
    email : Joi.string().email().min(5).required(),
    password : Joi.string().min(8).required()
});

export default { validateSignupSchema, validateSigninSchema };
