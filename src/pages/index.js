import Page from "@/web/components/Page.jsx"
import Post from "@/web/components/Post.jsx"
import routes from "@/web/routes.js"
import axios from "axios"

export const getServerSideProps = async ({ req: { url } }) => {
  const query = Object.fromEntries(
    new URL(`http://example.com/${url}`).searchParams.entries()
  )

  const { data } = await axios.get(
    `http://localhost:3000/api${routes.api.posts.collection(query)}`
  )

  return {
    props: {
      posts: data,
    },
  }
}

const IndexPage = (props) => {
  const {
    posts: { result },
  } = props

  return (
    <Page className="gap-8">
      {result.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </Page>
  )
}

IndexPage.isPublic = true

export default IndexPage
