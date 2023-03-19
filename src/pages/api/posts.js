import PostModel from "@/api/db/models/PostModel.js"
import validate from "@/api/middlewares/validate.js"
import mw from "@/api/mw.js"
import {
  boolValidator,
  limitValidator,
  orderFieldValidator,
  orderValidator,
  pageValidator,
} from "@/validators.js"

const handler = mw({
  GET: [
    validate({
      query: {
        limit: limitValidator,
        page: pageValidator,
        orderField: orderFieldValidator(["title", "content"]).default("title"),
        order: orderValidator.default("desc"),
        isPublished: boolValidator.default(true),
      },
    }),
    async ({
      locals: {
        query: { limit, page, orderField, order, isPublished },
      },
      res,
    }) => {
      const query = PostModel.query().modify("paginate", limit, page)

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
      const posts = await query.withGraphFetched("author")

      res.send({
        result: posts,
        meta: {
          count,
        },
      })
    },
  ],
})

export default handler
