/* global Worker */
const file = document.getElementById('import')
const worker = new Worker('worker.mjs', { type: 'module' })
file.addEventListener('change', () => {
  if (document.getElementById('placeholder')) {
    document.getElementById('placeholder').remove()
  }
  const projects = [...file.files]
  projects.forEach(blob => worker.postMessage(blob))
  worker.addEventListener('message', event => {
    const project = event.data
    console.log(project) // Log it for later
    // Now, for displaying this data:

    const info = document.createElement('p') // This will have most of the info
    info.innerText = `
  ${project.name} is ${project.width}x${project.height} and runs at ${project.framerate} FPS
  It was also made on ${project.metadata.platform.description}
  The background color was ${project.backgroundColor}`

    info.style.backgroundColor = 'white' // Change the website's background to match the project's background
    info.style.color = 'black'

    info.style.display = 'inline' // so it isn't big

    const button = document.createElement('button') // make a button
    button.innerText = 'Redownload' // set some text
    button.addEventListener('click', _ => {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(project.file)
      link.download = project.name + '.wick'
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      URL.revokeObjectURL(link.href)
    })
    document.getElementById('projects').appendChild(info)

    document.getElementById('projects').appendChild(button)
  })
})
