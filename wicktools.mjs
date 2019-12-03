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
   * Downloads project data from the internet
   *
   * @param {String} url A url to a .wick (.zip coming soon)
   * @returns {Object} The project data
   */
  static async url (url) {
    if (typeof url === 'string' && isWickLink(url)) {  // If it's a URL
      const res = await fetch(url) // Get that
      const blob = await res.blob() // Get the blob

      return await getProjectFrom.wick(blob)
    }
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

  /**
   * Get project data from a .zip file or .wick
   *
   * @param {Blob} file A .zip file with a project.wick file in it, or project.wick
   * @returns {Object} The project data
   */
  static async file (file) {
    if (file.name.endsWith('.wick')) return await getProjectFrom.wick(file)
    if (file.name.endsWith('.zip')) return await getProjectFrom.zip(file)
  }
}
class Project {

  /**
   * 
   * @param {String|Blob} URL, .wick, or .zip
   * @returns {Object} Project data
   */
  static async from (any) {
    if (typeof any === 'string' && isWickLink(any)) return await getProjectFrom.url(any)
    return await getProjectFrom.file(any)
  }
}

export {
  Project
}