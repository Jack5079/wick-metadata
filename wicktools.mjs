/** @requires ZipLoader */
import ZipLoader from 'https://cdn.pika.dev/zip-loader/^1.1.0';
/**
 * Checks if a link is a correct Wick Editor link.
 *
 * @param {String} str
 * @returns {Boolean} Returns if it's a good link
 */
function isWickLink (str) { // Check if it's correct
  if (str.startsWith('javascript:')) return false
  if (str.endsWith('.wick')) {
    var a = document.createElement('a');
    a.href = str;
    return (a.host && a.host != window.location.host);
  } else return false
}

class getProjectFrom {
  /**
   * Gets info about .wick files
   *
   * @param {Blob} file A .wick file
   * @returns {Object} The project data
   */
  static async wick (file) {
    const zip = await ZipLoader.unzip(file) // Unzip it
    const { project } = zip.extractAsJSON('project.json') // Get the project data
    return project
  }


  /**
   * Get project data from a .zip file
   *
   * @param {Blob} file A .zip file with a project.wick file in it
   * @returns {Object} The project data
   */
  static async zip (file) {
    const zip = await ZipLoader.unzip(file) // Unzip it
    return await getProjectFrom.wick(new Blob([zip.files['project.wick'].buffer]))
  }

}
class Project {

  /**
   * 
   * @param {String|Blob} .wick, or .zip
   * @returns {Object} Project data
   */
  constructor (file) {
   return (async ()=>{
    if (file.name.endsWith('.wick')) return await getProjectFrom.wick(file)
    if (file.name.endsWith('.zip')) return await getProjectFrom.zip(file)
   })()
  }
}

export {
  Project
}