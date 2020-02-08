/* global alert */
import Project from './wicktools.mjs'

async function addProject (proj) {
  if (
    proj.name.endsWith('.wick') ||
    proj.type === 'application/x-zip-compressed' ||
    proj.type === 'text/html'
  ) {
    const project = await new Project(proj)
    console.log(project) // Log it for later
    // Now, for displaying this data:
    const holder = document.createElement('article')
    holder.style.borderColor = project.backgroundColor
    const header = document.createElement('h3')
    header.innerText = project.name
    const res = document.createElement('abbr')
    res.innerText = project.height + 'p'
    res.title = `${project.width}x${project.height}`
    const info = document.createElement('p') // This will have most of the info
    info.innerText = `${project.framerate} FPS
  Platform: ${project.metadata.platform.description}`

    const button = document.createElement('button') // make a button
    button.innerText = '💾' // set some text
    button.addEventListener('click', project.download.bind(project))
    holder.appendChild(header)
    holder.appendChild(res)
    holder.appendChild(info)

    holder.appendChild(button)
    document.getElementById('projects').appendChild(holder)
  } else alert("That's not a project!")
}

document.getElementById('import').addEventListener('change', event => {
  if (document.getElementById('placeholder')) {
    document.getElementById('placeholder').remove()
  }
  const projects = [...event.currentTarget.files]
  projects.forEach(addProject)
})

document.head.addEventListener('dragover', event => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'none'
})

document.body.addEventListener('drop', event => {
  event.preventDefault()
  const projects = [...event.dataTransfer.files]
  projects.forEach(addProject)
})

document.body.addEventListener('dragover', event => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'copy'
})
