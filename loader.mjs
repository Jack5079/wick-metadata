import ZipLoader from 'https://cdn.pika.dev/zip-loader/^1.1.0';
function isWickLink (str) { // Check if it's correct
  if (str.startsWith('javascript:')) return false
  if (str.endsWith('.html') || str.endsWith('.wick')) {
    var a = document.createElement('a');
    a.href = str;
    return (a.host && a.host != window.location.host);
  } else return false
}

export default async file => {
  if (Blob.prototype.isPrototypeOf(file)) { // If it's a Blob
   const zip = await ZipLoader.unzip(file) // Unzip it
    const { project } = zip.extractAsJSON('project.json') // Get the project data
    return project
  } else if (typeof file === 'string' && isWickLink(file)) {  // If it's a URL
    const res = await fetch(file) // Get that
    const blob = await res.blob() // Get the blob

    const zip = await ZipLoader.unzip(blob) // Unzip it
    const { project } = zip.extractAsJSON('project.json') // Get the project data
    return project
  }
}