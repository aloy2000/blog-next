import BaseModel from "@/api/db/models/BaseModel.js"
import CommentModel from "@/api/db/models/CommentModel.js"
import UserModel from "@/api/db/models/UserModel.js"

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
          modify: (query) => query.select("id", "displayName"),
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
    }
  }
}

export default PostModel
