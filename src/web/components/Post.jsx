import { formatDate } from "@/web/formatters.js"

const Post = (props) => {
  const {
    post: { title, content, createdAt },
  } = props

  return (
    <article className="flex flex-col gap-4">
      <header className="border-b">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p>{formatDate(new Date(createdAt))}</p>
      </header>
      <div className="flex flex-col gap-4">
        {content.split("\n").map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  )
}

export default Post
