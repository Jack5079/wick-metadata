/** @requires ZipLoader */
import ZipLoader from 'https://cdn.pika.dev/zip-loader';

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
      if (file.type == 'application/x-zip-compressed') return Object.setPrototypeOf(await wick(new Blob([( await ZipLoader.unzip(file)).files['project.wick'].buffer])), Project.prototype)
      
      if (file.name.endsWith('.wick')) return Object.setPrototypeOf(await wick(file), Project.prototype)
   })()
  }
}

export {
  Project
}