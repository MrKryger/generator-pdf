const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const logger = morgan('combined');
const cors = require('cors');
const path = require('path');
const { createFormData, getPdfStream, getPdf } = require('./app/page/main')
const { handleError } = require('./app/module')

const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cors());
app.use('app/images', express.static(path.join(__dirname, 'images')));
app.set('app/page/views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');
app.use(logger);

app.post('/api/generator_pdf/:type', async (req, res) => {
  const { type } = req.params;
  const { file } = req.query;
  try {
    const response = await createFormData(req, type, file);
    res.json(response);
  } catch (error) {
    handleError(res, error, `Error generating HTML for ${type}:`);
  }
});
app.get('/api/generator_pdf/:type', async (req, res) => {
  const { type } = req.params;
  try {
    await getPdfStream(req, res, type)
  } catch (error) {
    handleError(res, error, 'Error generating PDF:')
  }
});
app.get('/api/generator_pdf_base/:type', async (req, res) => {
  const { type } = req.params;
  try {
    const data = await getPdf(req, res, type)
    const pdfBuffer = Buffer.from(data);
    res.setHeader('Content-Disposition', `attachment; filename="example.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    handleError(res, error, 'Error generating PDF:')
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
