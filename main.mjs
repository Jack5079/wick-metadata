import Project from './wicktools.mjs'

const file = document.getElementById('import')

file.addEventListener('change', () => {
  if (document.getElementById('placeholder')) {
    document.getElementById('placeholder').remove()
  }
  const projects = [...file.files]
  projects.forEach(async element => {
    const project = await new Project(element)
    console.log(project) // Log it for later
    // Now, for displaying this data:
    const holder = document.createElement('article')
    holder.style = `
      background: darkslategray;
      display: inline-block;
      padding: 1em;
      margin: 1em;
      border-radius: 1em;
      border: 0.5em ${project.backgroundColor} solid; 
    `
    const header = document.createElement('h3')
    header.innerText = project.name
    const info = document.createElement('p') // This will have most of the info
    info.innerText = `
  ${project.height}p
  ${project.framerate} FPS
  Platform: ${project.metadata.platform.description}`

    const button = document.createElement('button') // make a button
    button.innerText = 'Redownload' // set some text
    button.addEventListener('click', project.download.bind(project))
    holder.appendChild(header)

    holder.appendChild(info)

    holder.appendChild(button)
    document.getElementById('projects').appendChild(holder)
  })
})
