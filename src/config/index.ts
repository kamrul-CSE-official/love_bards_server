import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Define the schema for environment variables
const envVarsSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z.string().default('3030').refine((val) => Number(val) > 0, {
    message: 'PORT must be a positive number',
  }),
  JWT_SECRET: z.string().min(1, { message: 'JWT_SECRET is required' }),
  DB_URL: z.string().url({ message: 'DB_URL must be a valid URL' }),
});

// Parse and validate environment variables
const parseEnvVars = () => {
  try {
    return envVarsSchema.parse(process.env);
  } catch (error: any) {
    console.error('Environment variable validation error:', (error as Error)?.message);
    process.exit(1); // Exit if validation fails
  }
};

// Extract validated environment variables
const envVars = parseEnvVars();

// Export configuration
export default {
  env: envVars.NODE_ENV,
  port: Number(envVars.PORT) || 5000, 
  dbUrl: envVars.DB_URL,
  jwt: {
    secret: envVars.JWT_SECRET,
  },
};
