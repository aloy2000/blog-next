import RoleModel from "@/api/db/models/RoleModel"
import validate from "@/api/middlewares/validate"
import mw from "@/api/mw.js"
import { idValidator, limitValidator, orderFieldValidator, orderValidator, pageValidator, stringValidator } from "@/validators"


const handler = mw({
    GET: [
        validate({
            query: {
                limit: limitValidator,
                page: pageValidator,
                orderField: orderFieldValidator(["name", "autorisation"]).default("name"),
                order: orderValidator.default("desc"),
            },
        }),
        async ({
            locals: {
                query: { limit, page, orderField, order },
            },
            res,
        }) => {
            const query = RoleModel.query().modify("paginate", limit, page)



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
            const roles = await query.withGraphFetched("users")

            res.send({
                result: roles,
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
                const numDelete = await RoleModel.query().deleteById(id)
                if (!numDelete) {
                    res.status(404).send({ error: "role not found" })
                } else {
                    res.status(200).send({ response: `role with id ${id} deleted` })
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
            const { name, autorisation } = request.body
            const { id } = request.query

            try {
                const role = await RoleModel.query().findById(id)
                if (!role) {
                    return res.status(404).send({ message: "Role not found!" })
                }

                await role.$query().patch({ name, autorisation })
                res.send(role)

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
                autorisation: stringValidator
            }
        }),
        async (req) => {

            const request = req.req
            const res = req.res
            const { name, autorisation } = request.body

            try {

                await RoleModel.query().insertAndFetch({
                    name,
                    autorisation,
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