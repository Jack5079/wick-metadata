/* global addEventListener, postMessage */
import Project from './wicktools.mjs'

addEventListener('message', async e => postMessage(await new Project(e.data)))
