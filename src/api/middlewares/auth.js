import jsonwebtoken from 'jsonwebtoken'

const authenticate = async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).send({ error: 'Missing authorization header' })
  }

  const [, token] = authHeader.split(' ')
  try {
    const decoded = jsonwebtoken.verify(token, process.env.SECURITY__JWT__SECRET)
    req.user = decoded.payload.user
  } catch (error) {
    res.status(401).send({ error: 'Invalid or expired token' })
  }
}

export default authenticate;