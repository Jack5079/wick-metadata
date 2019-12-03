import ZipLoader from 'https://cdn.pika.dev/zip-loader/^1.1.0';
function isWickLink (str) { // Check if it's correct
  if (str.startsWith('javascript:')) return false
  if (str.endsWith('.wick')) {
    var a = document.createElement('a');
    a.href = str;
    return (a.host && a.host != window.location.host);
  } else return false
}

async function fromWick(file) {
  const zip = await ZipLoader.unzip(file) // Unzip it
  const { project } = zip.extractAsJSON('project.json') // Get the project data
  return project
}

async function fromUrl(url) {
  if (typeof file === 'string' && isWickLink(url)) {  // If it's a URL
    const res = await fetch(url) // Get that
    const blob = await res.blob() // Get the blob

    return await fromWick(blob)
  }
}
export {
 fromWick,
 fromUrl
}