const {ipcRenderer} = require('electron')
const submitListener = document.querySelector('form').addEventListener("submit", function(event) {
  event.preventDefault()
  const files = [...document.getElementById('filepicker').files]
  const filesFormatted = files.map(function({name, path: pathName}) {
    return {
      name,
      pathName
    }
  })
  ipcRenderer.send('files', filesFormatted)
})
  //listen for metadata
  ipcRenderer.on('metadata', (event, metadata) => {
    const pre = document.getElementById('data')
    pre.innerText = JSON.stringify(metadata, null, 2)
  })
  //metadata error catch block
  ipcRenderer.on('metadata:error', function(event, error) {
    console.error(error)
  })
