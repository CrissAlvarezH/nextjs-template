// This file runs before any test files or setup files
// It's responsible for loading environment variables from .env file

import dotenv from 'dotenv';
import path from 'path';

// Load .env file from the project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
