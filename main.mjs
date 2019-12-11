import Project from './wicktools.mjs'

const file = document.getElementById('import')

file.addEventListener('change', () => {
  if (document.getElementById('placeholder')) document.getElementById('placeholder').remove()
  const projects = [...file.files]
  projects.forEach(async blob => {
    const project = await new Project(blob) // Load it
    console.log(project) // Log it for later
    // Now, for displaying this data:

    const info = document.createElement('p') // This will have most of the info
    info.innerText = `
  ${project.name} is ${project.width}x${project.height} and runs at ${project.framerate} FPS
  It was also made on ${project.metadata.platform.description}`

    info.style.backgroundColor = project.backgroundColor // Change the website's background to match the project's background

    info.style.display = 'inline' // so it isn't big

    const button = document.createElement('button') // make a button
    button.innerText = 'Redownload' // set some text
    button.addEventListener('click', _ => { // on click
      project.download()
    })
    document.getElementById('projects').appendChild(info)

    document.getElementById('projects').appendChild(button)
  })
})
