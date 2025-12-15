const twig = require('twig')
const path = require('path')
const { Readable } = require('stream')
const { getProjectInfo } = require('../helper')
const { generatePDF, imageToBase64 } = require('../app')


let objTemp = {}
let clearVariableTimeout;
function accessVariable() {
  // Сбрасываем предыдущий таймер
  clearTimeout(clearVariableTimeout);
  // Устанавливаем новый таймер
  clearVariableTimeout = setTimeout(() => {
    objTemp = {};
  }, 60 * 1000);
}

const createFormData = async (req, name, file) => {
  const info = getProjectInfo(req.body.project)
  const data = req.body.data // Expecting JSON with title and body
  data.imagePath = await imageToBase64(info.link)
  data.footer = info
  data.project = info.name
  const htmlContent = await new Promise((resolve, reject) => {
    twig.renderFile(path.join(__dirname, 'views', `${name}.twig`), data, (err, html) => {
      if (err) reject(err)
      else resolve(html)
    })
  })
  const id = String(Math.random())
  objTemp[id] = htmlContent
  accessVariable();
  const protocol = req.protocol
  const host = req.get('host')
  const baseUrl = `${protocol}://${host}`
  if (file === 'base64') {
    return {
      redirectLink: `${baseUrl}/api/generator_pdf_base/${name}?id=${id}`
    }
  }
  return {
    redirectLink: `${baseUrl}/api/generator_pdf/${name}?id=${id}`
  }

}

const getPdfStream = async (req, res, name='default') => {
  const { id } = req.query // Expecting JSON with title and body
  const htmlContent = objTemp[id]
  const pdfBuffer = await generatePDF(htmlContent)
  const pdfStream = new Readable()
  pdfStream.push(pdfBuffer)
  pdfStream.push(null) // Signal end of stream
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition':`inline; filename="${name}.pdf"`, // Open in new window/tab
  })
  pdfStream.pipe(res)
}
const getPdf = async (req) => {
  const { id } = req.query
  const htmlContent = objTemp[id]
  return await generatePDF(htmlContent)
}

module.exports = {
  createFormData,
  getPdfStream,
  getPdf
}
