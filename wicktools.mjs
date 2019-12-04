/** @requires ZipLoader */
import ZipLoader from 'https://cdn.pika.dev/zip-loader/^1.1.0';

async function wick (file) {
    const zip = await ZipLoader.unzip(file) // Unzip it
    const { project } = zip.extractAsJSON('project.json') // Get the project data
    return project
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
      if (file.name.endsWith('.wick')) return await wick(file)
      if (file.name.endsWith('.zip')) {
        const zip = await ZipLoader.unzip(file) // Unzip it
        return await wick(new Blob([zip.files['project.wick'].buffer]))
      }
   })()
  }
}

export {
  Project
}