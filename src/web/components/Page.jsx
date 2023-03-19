import Link from "@/web/components/Link.jsx"
import useAppContext from "@/web/hooks/useAppContext.jsx"
import routes from "@/web/routes.js"
import clsx from "clsx"

const Page = (props) => {
  const { children, className } = props
  const {
    actions: { signOut },
    state: { session },
  } = useAppContext()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="mx-auto flex items-center justify-between md:max-w-3xl">
          <h1 className="p-4 text-2xl font-bold">
            <Link noStyle href={routes.home()}>
              BLOG
            </Link>
          </h1>
          <nav>
            <ul className="flex gap-4 p-4">
              {session ? (
                <>
                  <button
                    className="font-medium hover:underline"
                    onClick={signOut}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <li>
                    <Link href={routes.signIn()}>Sign In</Link>
                  </li>
                  <li>
                    <Link href={routes.signUp()}>Sign Up</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex grow bg-slate-50">
        <div
          className={clsx(
            "mx-auto flex grow flex-col bg-white  p-4 md:max-w-3xl",
            className
          )}
        >
          {children}
        </div>
      </main>
    </div>
  )
}

export default Page
