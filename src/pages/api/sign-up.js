import hashPassword from "@/api/db/hashPassword.js"
import UserModel from "@/api/db/models/UserModel.js"
import validate from "@/api/middlewares/validate.js"
import mw from "@/api/mw.js"
import {
  displayNameValidator,
  emailValidator,
  passwordValidator,
} from "@/validators.js"

const handler = mw({
  POST: [
    validate({
      body: {
        displayName: displayNameValidator.required(),
        email: emailValidator.required(),
        password: passwordValidator.required(),
      },
    }),
    async ({
      locals: {
        body: { displayName, email, password },
      },
      res,
    }) => {
      const user = await UserModel.query().findOne({ email })

      if (user) {
        res.send({ result: true })

        return
      }

      const [passwordHash, passwordSalt] = await hashPassword(password)

      await UserModel.query().insertAndFetch({
        displayName,
        email,
        passwordHash,
        passwordSalt,
      })

      res.send({ result: true })
    },
  ],
})

export default handler
