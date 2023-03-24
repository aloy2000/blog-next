import BaseModel from "@/api/db/models/BaseModel.js"
import PostModel from "./PostModel"


class MenuModel extends BaseModel {
    static tableName = "menus"

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
                        from: "rel_posts__menus.menuId",
                        to: "rel_posts__menus.postId",
                    },
                    to: "menus.id",
                },
            },
        }
    }

}

export default MenuModel