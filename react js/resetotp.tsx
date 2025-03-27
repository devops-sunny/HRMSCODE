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







------------------------------------------------------------

import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "5px";
    } else {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
  }, [isOpen]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).id === "add_project") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal fade show" id="add_project" role="dialog" style={{ display: 'block', opacity: 1 }} aria-modal="true" onClick={handleBackdropClick}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header header-border align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <h5 className="modal-title me-2">Add Project</h5>
                <p className="text-dark">HI</p>
              </div>
              <button type="button" className="btn-close custom-btn-close" onClick={onClose}>
                <i className="ti ti-x"></i>
              </button>
            </div>
            <div className="add-info-fieldset">
              <fieldset id="first-field-file">
                <form action="projects.html">
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Project Name</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Client</label>
                          <select className="select">
                            <option>Select</option>
                            <option>Anthony Lewis</option>
                            <option>Brian Villalobos</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Start Date</label>
                              <div className="input-icon-end position-relative">
                                <input type="text" className="form-control datetimepicker" placeholder="dd/mm/yyyy" defaultValue="02-05-2024" />
                                <span className="input-icon-addon">
                                  <i className="ti ti-calendar text-gray-7"></i>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">End Date</label>
                              <div className="input-icon-end position-relative">
                                <input type="text" className="form-control datetimepicker" placeholder="dd/mm/yyyy" defaultValue="02-05-2024" />
                                <span className="input-icon-addon">
                                  <i className="ti ti-calendar text-gray-7"></i>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Priority</label>
                              <select className="select">
                                <option>Select</option>
                                <option>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Project Value</label>
                              <input type="text" className="form-control" defaultValue="$" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Total Working Hours</label>
                              <div className="input-icon-end position-relative">
                                <input type="text" className="form-control timepicker" placeholder="-- : -- : --" defaultValue="02-05-2024" />
                                <span className="input-icon-addon">
                                  <i className="ti ti-clock-hour-3 text-gray-7"></i>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Extra Time</label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-0">
                          <label className="form-label">Description</label>
                          <div className="summernote"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <div className="d-flex align-items-center justify-content-end">
                      <button type="button" className="btn btn-outline-light border me-2" onClick={onClose}>Cancel</button>
                      <button className="btn btn-primary wizard-next-btn" type="button">Add Team Member</button>
                    </div>
                  </div>
                </form>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default Modal;
