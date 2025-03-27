import React from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useFormContext } from "react-hook-form";

interface RHFTextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
}

 function RHFTextField({ name, label, ...rest }: RHFTextFieldProps) {
  const { register } = useFormContext();

  return (
    <div className="input-container">
      <label>{label}</label>
      <input {...register(name)} {...rest} />
    </div>
  );
}


interface FormValues {
  users: { firstName: string; lastName: string }[];
}

const validationSchema = yup.object().shape({
  users: yup.array().of(
    yup.object().shape({
      firstName: yup.string().required("First Name is required"),
      lastName: yup.string().required("Last Name is required"),
    })
  ),
});

export default function App() {
  const methods = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: { users: [{ firstName: "Bill", lastName: "Luo" }] },
  });

  const { control, handleSubmit, reset } = methods;
  const { fields, append, remove } = useFieldArray({ control, name: "users" });

  const onSubmit = (data: FormValues) => console.log("Submitted Data:", data);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        <h1>Field Array Example</h1>
        <p>The following demo allows you to add, delete, and reset fields</p>

        <div className="field-array">
          {fields.map((item, index) => (
            <div key={item.id} className="field-group">
              <RHFTextField name={`users.${index}.firstName`} label="First Name" />
              <RHFTextField name={`users.${index}.lastName`} label="Last Name" />
              <button type="button" onClick={() => remove(index)} className="delete-btn">
                DELETE
              </button>
            </div>
          ))}
        </div>

        <div className="button-group">
          <button type="button" onClick={() => append({ firstName: "", lastName: "" })}>
            ADD MORE
          </button>
          <button type="button" onClick={() => remove(fields.length - 1)}>
            REMOVE LAST
          </button>
          <button type="button" onClick={() => reset()}>
            RESET
          </button>
        </div>

        <button type="submit" className="submit-btn">
          SUBMIT
        </button>
      </form>
    </FormProvider>
  );
}
