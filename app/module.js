
const handleError = (res, error, mess) => {
  console.error(mess, error);
  res.status(500).send(mess);
}

module.exports = {
  handleError
}
