export const S3_CONSTANTS = {
  DEFAULT_EXPIRATION: 3600, // 1 hour
  GET_URL_EXPIRATION: 86400, // 24 hours
  PRESIGNED_URL_EXPIRATION: 300, // 5 minutes
  MEDIA_PREFIX: 'media/',
  ERROR_MESSAGES: {
    MISSING_ENV: (key: string) =>
      `Missing required environment variable: ${key}`,
    MEDIA_KEY_GEN_FAILED: 'Failed to generate unique file key',
    PUT_URL_GEN_FAILED: 'Failed to generate upload URL',
    GET_URL_GEN_FAILED: 'Failed to generate download URL',
    PUBLIC_URL_GEN_FAILED: 'Failed to generate public URL',
    FILE_DELETE_FAILED: 'Failed to delete file',
    INIT_FAILED: 'Failed to initialize S3Service',
  },
  LOG_MESSAGES: {
    INIT_SUCCESS: (bucket: string) =>
      `S3Service initialized with bucket: ${bucket}`,
    FILE_DELETED: (key: string) => `Successfully deleted file: ${key}`,
  },
  ENV_KEYS: {
    REGION: 'AWS_REGION',
    ACCESS_KEY: 'AWS_ACCESS_KEY',
    SECRET_KEY: 'AWS_SECRET_KEY',
    BUCKET_NAME: 'AWS_BUCKET_NAME',
  },
};

export const MEDIA_CONSTANTS = {
  ERROR_MESSAGES: {
    GET_MEDIA_FAILED: 'Error getting media URL',
    GENERATE_URLS_FAILED: 'Error generating upload URL',
    DELETE_MEDIA_FAILED: 'Error deleting media files',
    FILE_DELETE_PARTIAL_FAIL: (success: number, failed: number) =>
      `Deleted ${success} files, failed to delete ${failed} files`,
  },
  RESPONSE_MESSAGES: {
    DELETE_SUCCESS: (count: number) => `Successfully deleted ${count} files`,
    URLS_GENERATED: (count: number) => `Generated URLs for ${count} files`,
  },
};
