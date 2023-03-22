import PostModel from "@/api/db/models/PostModel.js"
import validate from "@/api/middlewares/validate.js"
import mw from "@/api/mw.js"
import {
  boolValidator,
  idValidator,
  limitValidator,
  orderFieldValidator,
  orderValidator,
  pageValidator,
  stringValidator,

} from "@/validators.js"
import UserModel from "@/api/db/models/UserModel";
import authenticate from "@/api/middlewares/auth";
import RoleModel from "@/api/db/models/RoleModel";

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
        console.log("user:", role.name)

        if (role.name != "administrateur" && role.name != "gestionnaire") {
          return res.status(401).send({ message: "Unauthorized request" })
        }

        const numDelete = await PostModel.query().deleteById(id)
        if (!numDelete) {
          res.status(404).send({ error: "post not found" })
        } else {
          res.status(200).send({ response: `post with id ${id} deleted` })
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
        title: stringValidator,
        content: stringValidator,
      },
    }),
    async (req) => {
      const request = req.req
      const res = req.res
      const { title, content } = request.body

      try {

        const post = await PostModel.query().findById(request.query.id)
        if (!post) {
          return res.status(404).send({ message: "Post not found!" })
        }


        if (role.name !== "administrateur" || role.name !== "gestionnaire") {
          return res.status(401).send({ message: "Unauthorized request" })
        }
        await post.$query().patch({ title, content, updatedAt: new Date() })
        res.send(post)

      } catch (error) {
        console.log("error is occuring:", error)
        res.status(500).send({ error })
      }
    },

  ],
  POST: [
    validate({
      body: {
        title: stringValidator,
        content: stringValidator,
      }
    }),
    async (req) => {

      const request = req.req
      const res = req.res
      const { title, content, userId, slug_url, status } = request.body

      try {
        await authenticate(request, res)
        console.log("req.user:", request.user)
        const user = await UserModel.query().findById(userId)

        if (!user) {
          return res.status(404).send({ message: "user not found" })
        }

        const role = await RoleModel.query().findById(user.roleId)
        if (role.name !== "administrateur" && role.name !== "gestionnaire") {
          return res.status(401).send({ message: "Unauthorized request" })
        }

        const post = await PostModel.query().insert({ title, content, userId: user.id, publishedAt: new Date(), slug_url, status })
        res.status(201).send(post)
      } catch (error) {
        console.log("error is occuring:", error)
        res.status(500).send({ error })
      }
    },

  ]

})

export default handler
