import FormError from "@/web/components/FormError.jsx"
import { Formik, Form as FormikForm } from "formik"

const Form = (props) => {
  const { children, error, ...otherProps } = props

  return (
    <Formik {...otherProps}>
      <FormikForm
        noValidate
        className="flex flex-col gap-4 rounded-xl border p-4"
      >
        <FormError error={error} />
        {children}
      </FormikForm>
    </Formik>
  )
}

export default Form
