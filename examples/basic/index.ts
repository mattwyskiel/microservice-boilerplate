import { json } from './src/lib/lambda-utils';
import { logger } from './src/lib/logger';

logger.info(json({ foo: 'bar' }));
