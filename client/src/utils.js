/**
 * Higher-order function for async/await error handling
 * our higher-order function will take our async function, fetchData(), as an argument, and wrap our asynchronous code in a try/catch for us.
 * @param {function} fn an async function
 * @returns {function}
 */
export const catchErrors = fn => {
    return function(...args) {
      return fn(...args).catch((err) => {
        console.error(err);
      })
    }
}

/**
 * Format milliseconds to time duration
 * Since the Spotify API returns the duration of each track in milliseconds, 
 * we'll use the formatDuration utility function to convert that number into a human-readable format.
 * @param {number} ms number of milliseconds
 * @returns {string} formatted duration string
 * @example 216699 -> '3:36'
 */
 export const formatDuration = ms => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor(((ms % 60000) / 1000));
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}