/* global Blob, File, fetch */
// html regex
/** @requires ZipLoader */
import ZipLoader from 'https://cdn.pika.dev/zip-loader'
const html = /<[a-z][\s\S]*>/i

/**
 * .wick -> {...}
 *
 * @param {Blob|File} file A .wick file
 * @returns {Promise<Object>} JSON of the project
 */
async function wick (file) {
  const zip = await ZipLoader.unzip(file) // Unzip it
  const { project } = zip.extractAsJSON('project.json') // Get the project data
  project.file = file // just for redownloading
  return project
}

/**
 *
 *
 * @author Jack5079
 * @param {String} text Some text.
 * @returns {Promise<Blob>} A .wick file.
 */
async function html2wick (text) {
  // Convert the fetch to a blob
  return (
    await fetch(
      // Fetch the resulting base64
      'data:application/zip;base64,' +
        text
          .split('\n') // array of lines
          .find(line => line.includes('INJECTED_WICKPROJECT_DATA')) // only the line of code we want
          // Now for stripping it down to only the data
          .replace("window.INJECTED_WICKPROJECT_DATA = '", '') // remove opening
          .replace("';", '') // remove ending
    )
  ).blob()
}

/**
 *
 *
 * @author Jack5079
 * @param {Blob} file A .zip file.
 * @returns {Promise<Blob>} A .wick file.
 */

const zip = async file =>
  new Blob([(await ZipLoader.unzip(file)).files['project.wick'].buffer]) // Convert .zip to .wick

export default class {
  /**
   * Wick Editor projects -> {...}
   *
   * @param {File} .wick, .html, or .zip
   * @returns {Promise<Project>} Project data
   * @async
   */
  constructor (file) {
    if (!(file instanceof File)) throw new Error('Must be a File!')
    return (async () => {
      if (file.type === 'application/x-zip-compressed') {
        // For .zip
        // Add prototype to JSON
        return Object.setPrototypeOf(
          // Convert wick to JSON
          await wick(await zip(file)),
          this.constructor.prototype
        )
      }
      if (file.name.endsWith('.wick')) {
        // For .wick
        // Add prototype to JSON
        return Object.setPrototypeOf(
          await wick(file), // Convert .wick to JSON
          this.constructor.prototype
        )
      }
      const text = await file.text()
      if (html.test(text)) {
        // If it has HTML tags
        // Add prototype to JSON
        return Object.setPrototypeOf(
          // Convert wick to JSON
          await wick(await html2wick(text)),
          this.constructor.prototype
        )
      }
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
