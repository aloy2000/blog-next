import hashPassword from "@/api/db/hashPassword"
import RoleModel from "@/api/db/models/RoleModel"
import UserModel from "@/api/db/models/UserModel"
import authenticate from "@/api/middlewares/auth"
import validate from "@/api/middlewares/validate"
import mw from "@/api/mw.js"
import { emailValidator, idValidator, limitValidator, orderFieldValidator, orderValidator, pageValidator, passwordValidator, stringValidator } from "@/validators"


const handler = mw({
    GET: [
        validate({
            query: {
                limit: limitValidator,
                page: pageValidator,
                orderField: orderFieldValidator(["name", "lastName"]).default("name"),
                order: orderValidator.default("desc"),
            },
        }),
        async ({
            locals: {
                query: { limit, page, orderField, order, isPublished },
            },
            res,
        }) => {
            const query = UserModel.query().modify("paginate", limit, page)

            if (isPublished) {
                query.whereNotNull("publishedAt")
            }

            if (orderField) {
                query.orderBy(orderField, order)
            }

            const [countResult] = await query
                .clone()
                .clearSelect()
                .clearOrder()
                .limit(1)
                .offset(0)
                .count()
            const count = Number.parseInt(countResult.count, 10)
            const users = await query.withGraphFetched("roles")

            res.send({
                result: users,
                meta: {
                    count,
                },
            })
        },
    ],
    DELETE: [
        validate({
            params: {
                id: idValidator,
            },
        }),
        async (req) => {
            const request = req.req
            const res = req.res
            const { id } = request.query
            try {
                await authenticate(request, res)
                const userId = request.user.id // user id  who request to delete user 
                const user = await UserModel.query().findById(userId)
                const role = await RoleModel.query().findById(user.roleId)
                console.log("user:", role.name)

                if (role.name != "administrateur") {
                    return res.status(401).send({ message: "Unauthorized request" })
                }

                const numDelete = await UserModel.query().deleteById(id)
                if (!numDelete) {
                    res.status(404).send({ error: "user not found" })
                } else {
                    res.status(200).send({ response: `user with id ${id} deleted` })
                }
            } catch (error) {
                console.log("error is occuring:", error)
                res.status(500).send({ error })
            }

        }
    ],
    PUT: [
        validate({
            params: {
                id: idValidator,
            },
        }),
        async (req) => {
            const request = req.req
            const res = req.res

            const { name, lastName, roleId } = request.body


            try {
                await authenticate(request, res)
                const userId = request.user.id
                const user = await UserModel.query().findById(userId)
                const role = await RoleModel.query().findById(user.roleId)
                if (!user) {
                    return res.status(404).send({ message: "Post not found!" })
                }


                if (role.name !== "administrateur") {
                    return res.status(401).send({ message: "Unauthorized request" })
                }
                await user.$query().patch({ name: name, lastName, roleId })
                res.send(user)

            } catch (error) {
                console.log("error is occuring:", error)
                res.status(500).send({ error })
            }
        },

    ],
    POST: [
        validate({
            body: {
                name: stringValidator,
                lastName: stringValidator,
                email: emailValidator,
                password: passwordValidator,
                roleId: idValidator
            }
        }),
        async (req) => {

            const request = req.req
            const res = req.res
            const { name, lastName, password, email, roleId } = request.body

            try {
                await authenticate(request, res)
                const userId = request.user.id
                const userWhoMakeRequest = await UserModel.query().findById(userId)
                const role = await RoleModel.query().findById(userWhoMakeRequest.roleId)

                if (!userWhoMakeRequest) {
                    return res.status(404).send({ message: "Post not found!" })
                }

                if (role.name != "administrateur") {
                    return res.status(401).send({ message: "Unauthorized request" })
                }

                const user = await UserModel.query().findOne({ email })
                if (user) {
                    res.send({ result: true })
                    return
                }

                const [passwordHash, passwordSalt] = await hashPassword(password)
                await UserModel.query().insertAndFetch({
                    name,
                    lastName,
                    email,
                    passwordHash,
                    passwordSalt,
                    roleId: roleId
                })
                res.send({ result: true })

            } catch (error) {
                console.log("error is occuring:", error)
                res.status(500).send({ error })
            }
        },

    ]

})

export default handler