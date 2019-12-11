/* global Blob, File, fetch */
/** @requires ZipLoader */
import ZipLoader from 'https://cdn.pika.dev/zip-loader'

/**
 * .wick -> {...}
 *
 * @param {Blob|File} file A .wick file
 * @returns {Object} JSON of the project
 */
async function wick (file) {
  const zip = await ZipLoader.unzip(file) // Unzip it
  const { project } = zip.extractAsJSON('project.json') // Get the project data
  project.file = file // just for redownloading
  return project
}

/**
 * .html -> .wick
 *
 * @param {Blob|File} file The .html to get the JSON from
 * @returns {Blob} .wick Blob
 */
async function htmlobj (file) {
  const text = await file.text()
  const INJECTED_WICKPROJECT_DATA = text
    .split('\n') // array of lines
    .find(h => h.includes('INJECTED_WICKPROJECT_DATA')) // only the line of code we want
    // Now for stripping it down to only the data
    .replace(/'/g, '') // remove quotes
    .replace('window.INJECTED_WICKPROJECT_DATA =', '') // remove opening
    .replace(/\s/g, '') // remove whitespace
    .replace(';', '') // remove ending semicolon
  const result = await (await fetch(`data:application/zip;base64,${INJECTED_WICKPROJECT_DATA}`)).blob()
  return result
}

/**
 * .zip -> .wick
 *
 * @param {Blob|File} file The .zip to get the JSON from
 * @returns {Blob} .wick Blob
 */
async function zip (file) {
  const buffer = (await ZipLoader.unzip(file)).files['project.wick'].buffer
  const wickfile = new Blob([buffer])
  return wickfile
}

class Project {
  /**
   * Wick Editor projects -> {...}
   *
   * @param {String|Blob} .wick, .html, or .zip
   * @returns {Object} Project data
   */
  constructor (file) {
    if (!(file instanceof File)) throw new Error('Must be a File!')

    return (async () => {
      if (file.type === 'application/x-zip-compressed') return Object.setPrototypeOf(await wick(await zip(file)), Project.prototype)
      if (file.name.endsWith('.wick')) return Object.setPrototypeOf(await wick(file), Project.prototype)
      if (file.type === 'text/html') return Object.setPrototypeOf(await wick(await htmlobj(file)), Project.prototype)
      throw new Error('Must be a .zip, .wick, or .html!')
    })()
  }

  download () {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(this.file)
    link.download = this.name + '.wick'
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    URL.revokeObjectURL(link.href)
  }
}

export default Project
