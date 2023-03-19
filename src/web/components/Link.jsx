import clsx from "clsx"
import NextLink from "next/link"

const Link = (props) => {
  const { className, noStyle, ...otherProps } = props

  return (
    <NextLink
      className={clsx({ "font-medium hover:underline": !noStyle }, className)}
      {...otherProps}
    />
  )
}

export default Link
