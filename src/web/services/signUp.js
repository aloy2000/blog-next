import routes from "@/web/routes.js"

const signUp =
  ({ api }) =>
  async ({ displayName, email, password }) => {
    try {
      const { data } = await api.post(routes.api.signUp(), {
        displayName,
        email,
        password,
      })

      return [null, data]
    } catch (err) {
      const error = err.response?.data?.error || "Oops. Something went wrong"

      return [Array.isArray(error) ? error : [error]]
    }
  }

export default signUp
