/** @requires ZipLoader */
import ZipLoader from 'https://cdn.pika.dev/zip-loader';

async function wick (file) {
    const zip = await ZipLoader.unzip(file) // Unzip it
    const { project } = zip.extractAsJSON('project.json') // Get the project data
    return project
}

async function html (file) {
  var reader = new FileReader();
  reader.readAsText(file);
  const result = await new Promise((resolve) => {
    reader.onload = async function() {
          eval(reader.result.split('\n').filter(h=>h.includes('INJECTED_WICKPROJECT_DATA'))[0]) // now we have the project data
    let file = await (await fetch(`data:application/zip;base64,${INJECTED_WICKPROJECT_DATA}`)).blob()
    resolve(file)
    }
  })

  return result
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
      if (file.type == 'text/html') return Object.setPrototypeOf(await wick(await html(file)), Project.prototype)
   })()
  }
}

export {
  Project
}