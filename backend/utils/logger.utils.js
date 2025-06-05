const logger = {
  // Only log errors
  error: (message) => {
    console.error(`Error: ${message}`);
  },
  
  // Only log specific database connection messages
  info: (message) => {
    if (
      message === 'MySQL database connected successfully' ||
      message === 'MongoDB database connected successfully' ||
      message === 'Server running on port 5000'
    ) {
      console.log(message);
    }
  },

  warn: (message) => {
    console.warn(`[WARN] ${message}`);
  },

  debug: (message) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`);
    }
  }
};

export default logger; 