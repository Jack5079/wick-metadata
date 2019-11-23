import load from './loader.mjs'

const file = document.getElementById('import')

file.addEventListener('change', async () => {
  const blob = file.files[0] // The added file
  const project = await load(blob) // Load it
  console.log(project) // Log it for later
  // Now, for displaying this data:

  const info = document.createElement('p') // This will have most of the info
  info.innerText = `
  ${project.name} is ${project.width}x${project.height} and runs at ${project.framerate} FPS
  It was also made on ${project.metadata.platform.description}`

  info.style = 'mix-blend-mode: difference;' // contrast
  info.style.backgroundColor = project.backgroundColor // Change the website's background to match the project's background

  info.style.display = 'inline' // so it isn't big
  document.body.appendChild(info)
})