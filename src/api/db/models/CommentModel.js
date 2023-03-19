import BaseModel from "@/api/db/models/BaseModel.js"
import PostModel from "@/api/db/models/PostModel.js"
import UserModel from "@/api/db/models/UserModel.js"

class CommentModel extends BaseModel {
  static tableName = "comments"

  static relationMappings() {
    return {
      author: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "comments.userId",
          to: "users.id",
          modify: (query) => query.select("id", "displayName"),
        },
      },
      post: {
        relation: BaseModel.HasManyRelation,
        modelClass: PostModel,
        join: {
          from: "comments.postId",
          to: "posts.id",
        },
      },
    }
  }
}

export default CommentModel
