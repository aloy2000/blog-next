import "@/styles/globals.css"
import { AppContextProvider } from "@/web/hooks/useAppContext.jsx"

const App = ({ Component, pageProps }) => {
  return (
    <AppContextProvider isPublicPage={Component.isPublic}>
      <Component {...pageProps} />
    </AppContextProvider>
  )
}

export default App
