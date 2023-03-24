import BaseModel from "@/api/db/models/BaseModel.js"
import CommentModel from "@/api/db/models/CommentModel.js"
import UserModel from "@/api/db/models/UserModel.js"
import MenuModel from "./MenuModel"
import FieldModel from "./FieldModel"

class PostModel extends BaseModel {
  static tableName = "posts"

  static modifiers = {
    paginate: (query, limit, page) =>
      query.limit(limit).offset((page - 1) * limit),
  }

  static relationMappings() {
    return {
      author: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "posts.userId",
          to: "users.id",
          modify: (query) => query.select("id", "name"),
        },
      },
      comments: {
        relation: BaseModel.HasManyRelation,
        modelClass: CommentModel,
        join: {
          from: "posts.id",
          to: "comments.postId",
        },
      },
      menu: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: MenuModel,
        join: {
          from: "posts.id",
          through: {
            from: "rel_posts__menus.postId",
            to: "rel_posts__menus.menuId",
          },
          to: "menus.id",
        },
      },
      field: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: FieldModel,
        join: {
          from: "posts.id",
          through: {
            from: "rel_posts__fields.postId",
            to: "rel_posts__fields.fieldId",
          },
          to: "fields.id",
        },
      }

    }
  }
}

export default PostModel
