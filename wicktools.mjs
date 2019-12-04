/** @requires ZipLoader */
import ZipLoader from 'https://cdn.pika.dev/zip-loader';

/**
 * .wick -> {...}
 *
 * @param {Blob|File} file A .wick file
 * @returns {Object} JSON of the project
 */
async function wick (file) {
    const zip = await ZipLoader.unzip(file) // Unzip it
    const { project } = zip.extractAsJSON('project.json') // Get the project data
    return project
}

/**
 * .html -> {...}
 *
 * @param {Blob|File} file The .html to get the .wick from
 * @returns {Blob} The .wick file
 */
async function htmlobj (file) {
    let text = await file.text()
    eval(text.split('\n').filter(h=>h.includes('INJECTED_WICKPROJECT_DATA'))[0]) // now we have the project data
    let result = await (await fetch(`data:application/zip;base64,${INJECTED_WICKPROJECT_DATA}`)).blob()
    delete globalThis.INJECTED_WICKPROJECT_DATA // remove it now that we're done
    return await wick(result)
}

class Project {

  /**
   * Wick Editor projects -> {...}
   * 
   * @param {String|Blob} .wick, .html, or .zip
   * @returns {Object} Project data
   */
  constructor (file) {
    if (file.constructor != File && file.constructor != Blob) throw new Error('Must be a Blob or File!')
    
   return (async ()=>{
      if (file.type == 'application/x-zip-compressed') return Object.setPrototypeOf(await wick(new Blob([( await ZipLoader.unzip(file)).files['project.wick'].buffer])), Project.prototype)
      if (file.name.endsWith('.wick')) return Object.setPrototypeOf(await wick(file), Project.prototype)
      if (file.type == 'text/html') return Object.setPrototypeOf(await htmlobj(file), Project.prototype)
      throw new Error('Must be a .zip, .wick, or .html!')
   })()
  }
}

export {
  Project
}