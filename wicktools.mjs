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
 * .html -> .wick
 *
 * @param {String} text The .html string to get the JSON from
 * @returns {Promise<Blob>} .wick Blob
 */
async function htmlobj (text) {
  const INJECTED_WICKPROJECT_DATA = text
    .split('\n') // array of lines
    .find(line => line.includes('INJECTED_WICKPROJECT_DATA')) // only the line of code we want
    // Now for stripping it down to only the data
    .replace(/'/g, '') // remove quotes
    .replace('window.INJECTED_WICKPROJECT_DATA =', '') // remove opening
    .trim() // remove whitespace
    .replace(';', '') // remove ending semicolon
  const result = await (
    await fetch(`data:application/zip;base64,${INJECTED_WICKPROJECT_DATA}`)
  ).blob()
  return result
}

/**
 * .zip -> .wick
 *
 * @param {Blob|File} file The .zip to get the JSON from
 * @returns {Promise<Blob>} .wick Blob
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
          await wick(
            await zip(file) // Convert .zip to .wick
          ),
          Project.prototype
        )
      }
      if (file.name.endsWith('.wick')) {
        // For .wick
        // Add prototype to JSON
        return Object.setPrototypeOf(
          await wick(file), // Convert .wick to JSON
          Project.prototype
        )
      }
      const text = await file.text()
      if (html.test(text)) {
        // If it has HTML tags
        // Add prototype to JSON
        return Object.setPrototypeOf(
          // Convert wick to JSON
          await wick(
            // Convert HTML text to .wick
            await htmlobj(
              await file.text() // convert blob to html text
            )
          ),
          Project.prototype
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

export default Project
