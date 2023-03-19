const createRouteWithQueryParams = (route, query) => {
  if (!query) {
    return route
  }

  const qs = new URLSearchParams(query).toString()

  return `${route}?${qs}`
}

const routes = {
  home: () => "/",
  signUp: () => "/sign-up",
  signIn: () => "/sign-in",
  api: {
    signUp: () => "/sign-up",
    signIn: () => "/sign-in",
    posts: {
      collection: (query) => createRouteWithQueryParams("/posts", query),
      single: (postId, query) =>
        createRouteWithQueryParams(`/posts/${postId}`, query),
    },
  },
}

export default routes
