import MenuModel from "@/api/db/models/MenuModel"
import RoleModel from "@/api/db/models/RoleModel"
import UserModel from "@/api/db/models/UserModel"
import authenticate from "@/api/middlewares/auth"
import validate from "@/api/middlewares/validate"
import mw from "@/api/mw.js"
import { boolValidator, idValidator, limitValidator, orderFieldValidator, orderValidator, pageValidator, stringValidator } from "@/validators"


const handler = mw({
    GET: [
        validate({
            query: {
                limit: limitValidator,
                page: pageValidator,
                orderField: orderFieldValidator(["name", "hierachical_list"]).default("name"),
                order: orderValidator.default("desc"),
                isPublished: boolValidator.default(true),

            },
        }),
        async ({
            locals: {
                query: { limit, page, orderField, order },
            },
            res,
        }) => {
            const query = MenuModel.query().modify("paginate", limit, page)

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
            const menus = await query.withGraphFetched("posts")

            res.send({
                result: menus,
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
                const userId = request.user.id
                const user = await UserModel.query().findById(userId)
                const role = await RoleModel.query().findById(user.roleId)

                if (role.name != "administrateur" && role.name != "gestionnaire") {
                    return res.status(401).send({ message: "Unauthorized request" })
                }

                const numDelete = await MenuModel.query().deleteById(id)
                if (!numDelete) {
                    res.status(404).send({ error: "menu not found" })
                } else {
                    res.status(200).send({ response: `menu with id ${id} deleted` })
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
            body: {
                name: stringValidator,
                hierachical_list: stringValidator,
            },
        }),
        async (req) => {
            const request = req.req
            const res = req.res
            const { name, hierarchical_list } = request.body

            try {

                const menu = await MenuModel.query().findById(request.query.id)
                await authenticate(request, res)
                const userId = request.user.id
                const user = await UserModel.query().findById(userId)
                const role = await RoleModel.query().findById(user.roleId)

                if (!menu) {
                    return res.status(404).send({ message: "menu not found!" })
                }


                if (role.name !== "administrateur" && role.name !== "gestionnaire") {
                    return res.status(401).send({ message: "Unauthorized request" })
                }
                await menu.$query().patch({ name, hierarchical_list })
                res.send(menu)

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
                hierachical_list: stringValidator,
            }
        }),
        async (req) => {

            const request = req.req
            const res = req.res
            const { name, hierarchical_list } = request.body

            try {
                await authenticate(request, res)
                const userId = request.user.id
                const user = await UserModel.query().findById(userId)

                if (!user) {
                    return res.status(404).send({ message: "user not found" })
                }

                const role = await RoleModel.query().findById(user.roleId)
                if (role.name !== "administrateur" && role.name !== "gestionnaire") {
                    return res.status(401).send({ message: "Unauthorized request" })
                }

                const menu = await MenuModel.query().insert({ name, hierarchical_list })
                res.status(201).send(menu)
            } catch (error) {
                console.log("error is occuring:", error)
                res.status(500).send({ error })
            }
        },

    ]
})

export default handler