import BaseModel from "@/api/db/models/BaseModel.js"
import PostModel from "./PostModel"


class FieldModel extends BaseModel {
    static tableName = "fields"

    static modifiers = {
        paginate: (query, limit, page) =>
            query.limit(limit).offset((page - 1) * limit),
    }

    static relationMappings() {
        return {
            posts: {
                relation: BaseModel.ManyToManyRelation,
                modelClass: PostModel,
                join: {
                    from: "posts.id",
                    through: {
                        from: "rel_posts__fields.fieldId",
                        to: "rel_posts__fields.postId",
                    },
                    to: "fields.id",
                },
            },
        }
    }


}

export default FieldModel