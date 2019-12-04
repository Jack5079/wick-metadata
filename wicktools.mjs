/** @requires ZipLoader */
import ZipLoader from 'https://cdn.pika.dev/zip-loader/^1.1.0';

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
    if (file.constructor != File && file.constructor != Blob) throw new Error('Must be a Blob or File!')
   return (async ()=>{
      if (file.name.endsWith('.wick')) return await getProjectFrom.wick(file)
      if (file.name.endsWith('.zip')) return await getProjectFrom.zip(file)
   })()
  }
}

export {
  Project
}