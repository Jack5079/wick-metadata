import ZipLoader from 'https://cdn.pika.dev/zip-loader/^1.1.0';
function isWickLink (str) { // Check if it's correct
  if (str.startsWith('javascript:')) return false
  if (str.endsWith('.wick') || str.endsWith('.html')) {
    var a = document.createElement('a');
    a.href = str;
    return (a.host && a.host != window.location.host);
  } else return false
}

async function getProject(file) {
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

export default async file => {
  let output
  if (typeof file === 'string' && isWickLink(file)) output = await getProject(file)
  if (Blob.prototype.isPrototypeOf(file)) {
    if (file.type == 'text/html') {
              var reader = new FileReader();
    reader.onload = async function() {
      eval(reader.result.split('\n').filter(h=>h.includes('INJECTED_WICKPROJECT_DATA'))[0]) // now we have the project data
      let wickfile = await (await fetch(`data:application/zip;base64,${INJECTED_WICKPROJECT_DATA}`)).blob()
      output = await getProject(wickfile)
    }
    reader.readAsText(file);
    } else output = await getProject(file)
  }

  if (output)  {return output } else return {
    name: 'Project not found',
    width: 1920,
    height: 1080,
    framerate: 60,
    metadata: {
      platform: {
        description: 'Nothing'
      }
    },
    backgroundColor: '#fff'
  }
}