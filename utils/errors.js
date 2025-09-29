const error500 = (res, err) => {
  return res.status(500).send({message: err.message})
}

const error400 = (res, err) => {
  return res.status(400).send({message: err.message})
}

const error404 = (res, err) => {
  return res.status(404).send({message: err.message})
}

module.exports = {error400, error404, error500}