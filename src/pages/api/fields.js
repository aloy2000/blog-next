import FieldModel from "@/api/db/models/FieldModel"
import validate from "@/api/middlewares/validate"
import mw from "@/api/mw.js"
import { idValidator, limitValidator, orderFieldValidator, orderValidator, pageValidator, stringValidator } from "@/validators"


const handler = mw({
    GET: [
        validate({
            query: {
                limit: limitValidator,
                page: pageValidator,
                orderField: orderFieldValidator(["type", "options", "label", "default_value"]).default("type"),
                order: orderValidator.default("desc"),
            },
        }),
        async ({
            locals: {
                query: { limit, page, orderField, order },
            },
            res,
        }) => {
            const query = FieldModel.query().modify("paginate", limit, page)



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
            const fields = await query.withGraphFetched("posts")

            res.send({
                result: fields,
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
                const numDelete = await FieldModel.query().deleteById(id)
                if (!numDelete) {
                    res.status(404).send({ error: "field not found" })
                } else {
                    res.status(200).send({ response: `field with id ${id} deleted` })
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
                type: stringValidator,
                option: stringValidator,
                label: stringValidator,
                default_value: stringValidator
            }
        }),
        async (req) => {
            const request = req.req
            const res = req.res
            const { type, option, label, default_value } = request.body
            const { id } = request.query

            try {
                const field = await FieldModel.query().findById(id)
                if (!field) {
                    return res.status(404).send({ message: "Field not found!" })
                }

                await field.$query().patch({ type, option, label, default_value })
                res.status(200).send(field)

            } catch (error) {
                console.log("error is occuring:", error)
                res.status(500).send({ error })
            }
        },

    ],
    POST: [
        validate({
            body: {
                type: stringValidator,
                option: stringValidator,
                label: stringValidator,
                default_value: stringValidator
            }
        }),
        async (req) => {

            const request = req.req
            const res = req.res
            const { type, option, label, default_value } = request.body


            try {

                await FieldModel.query().insertAndFetch({
                    type, option, label, default_value
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