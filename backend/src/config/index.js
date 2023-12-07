import { Joi } from 'express-validation';
import * as dotenv from 'dotenv';

const envConfig = dotenv.config();

if (envConfig.error) {
  throw new Error(`Environment file config error: ${envConfig.error}`);
}

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().required(),
  PORT: Joi.number()
    .default(4040),
  WS_PORT: Joi.number()
    .default(4041),
}).unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  WS_PORT: envVars.WS_PORT,
};

export default config;
