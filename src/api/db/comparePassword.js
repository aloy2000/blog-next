import { pbkdf2 as pbkdf2Callback } from "node:crypto"
import { promisify } from "node:util"
import config from "../config.js"

const pbkdf2 = promisify(pbkdf2Callback)

const comparePassword = async (password, hashedPassword, salt) => {
    const hashedInputPassword = await pbkdf2(
        `${password}${config.security.password.pepper}`,
        salt,
        config.security.password.iterations,
        config.security.password.keylen,
        config.security.password.digest
    )

    return hashedInputPassword.toString("hex") === hashedPassword
}

export default comparePassword