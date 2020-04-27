const sourceCanvas = document.getElementById('source')
const resultCanvas = document.getElementById('result')
const fileInput = document.getElementById('file-input')

const sourceCtx = sourceCanvas.getContext('2d')
const resultCtx = resultCanvas.getContext('2d')

const HEIGHT = 700

let imageWidth = 0
let imageHeight = 0

const updateCanvasSize = () => {
  sourceCanvas.width = imageWidth
  sourceCanvas.height = imageHeight
  resultCanvas.width = imageWidth
  resultCanvas.height = imageHeight
}

const readAsDataUrl = (file) => new Promise((resolve) => {
  const reader = new FileReader()
  reader.onload = (e) => resolve(e.target.result)
  reader.readAsDataURL(file)
})

const loadImage = (src) => new Promise((resolve) => {
  const img = new Image()
  img.onload = () => resolve(img)
  img.src = src
})

const decel = (x) => 1-(x-1)*(x-1) // easing

fileInput.addEventListener('input', async (e) => {
  console.log(e)
  if (fileInput.files && fileInput.files[0]) {
    console.log(fileInput.files[0])
    const dataUrl = await readAsDataUrl(fileInput.files[0])
    const img = await loadImage(dataUrl)

    imageWidth = Math.floor(img.width * HEIGHT / img.height)
    imageHeight = HEIGHT

    updateCanvasSize()

    sourceCtx.drawImage(img, 0, 0, imageWidth, imageHeight)

    const imgd = sourceCtx.getImageData(0, 0, imageWidth, imageHeight)
    const pix = imgd.data
    const n = pix.length

    for (let i = 0; i < n; i += 4) {
      const grayscale = pix[i + 3] === 0 ? 255 : pix[i] * .3 + pix[i + 1] * .59 + pix[i + 2] * .11
      pix[i] = grayscale
      pix[i + 1] = grayscale
      pix[i + 2] = grayscale
      pix[i + 3] = 255
    }

    // let points = []

    resultCtx.fillStyle = '#ffffff'
    resultCtx.fillRect(0, 0, imageWidth, imageHeight)

    for (let y = 0; y < 50; ++y) {
      resultCtx.beginPath()
      resultCtx.lineWidth = 2
      resultCtx.lineJoin = 'round'

      let l = 0;

      for (let x = 0; x < imageWidth; ++x) {
        const c = pix[((y * imageHeight / 50 + 6) * imageWidth + x)*4]

        // points.push([x, y * imageHeight / 50 + 6])

        l += (255 - c) / 255

        const m = (255 - c) / 255

        resultCtx.lineTo(
          x,
          (y + 0.5) * imageHeight / 50 + Math.sin(l * Math.PI / 2) * 5 * decel(m)
        )
      }
      resultCtx.stroke()
    }

    // resultCtx.fillStyle = 'red'
    // points.forEach(([x, y]) => {
    //   resultCtx.beginPath()
    //   resultCtx.arc(x, y, 1, 0, 2 * Math.PI)
    //   resultCtx.fill()
    // })
  }
})