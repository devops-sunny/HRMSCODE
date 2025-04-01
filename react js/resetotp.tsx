import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@mui/material';

export default function ConfirmDialog(props) {
  const { confirmDialog, setConfirmDialog } = props;
  return (
    <Dialog open={confirmDialog.isOpen}>
      <DialogTitle>{confirmDialog.title}</DialogTitle>
      <DialogContent>
        <Typography variant="h6">{confirmDialog.subTitle}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}>No</Button>
        <Button onClick={confirmDialog.onConfirm}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
}


// modal-dialog modal-dialog-centered modal-lg

import React, { useEffect, useState } from "react";
import ConfirmDialog from "../../../components/ConFirmDialog";
import DoctorForm from "./DoctorForm";
import Table from "../../../components/Table";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteDoctorData,
  getDoctorData,
  doctorModelClose,
  doctorModelOpen,
} from "../../../redux/Doctor/Action";
import { getSpecializationData } from "../../../redux/Specialization/Action";
import moment from "moment-hijri";
import Iconify from "../../../components/Iconify";
import Layout from "../../../Layout";
import { useTableSearch } from "../../../hook/useTableSearch";
import { getAffiliationData } from "../../../redux/Affiliation/Action";

const initialValues = {
  id: "",
  doctor_id: "",
  name_english: "",
  name_arabic: "",
  email: "",
  contact: "",
  SCFHS_license: "",
  MOH_license: "",
  address: "",
  address_line1: "",
  address_line2: "",
  city: "",
  country: "",
  state: "",
  zip_code: "",
  specialization_title: "",
  specialization_id: "",
  affiliation_title: "",
  affiliation_id: "",
  status_id: "",
  status_title: "",
  date: "",
};

const Doctor = () => {
  const [currentRow, setCurrentRow] = useState(initialValues);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const [doctorData, setDoctorData] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const { filteredData, loading } = useTableSearch({
    searchVal,
    retrieve: doctorData,
  });
  const dispatch = useDispatch();
  const doctorsData = useSelector((state) => state.Doctor.doctors);
  const isModelOpen = useSelector((state) => state.Doctor.isModelOpen);

  const specializations = useSelector(
    (state) => state.Specialization.specializations
  );

  const affiliation = useSelector((state) => state.Affiliation.Affiliation);

  useEffect(() => {
    dispatch(getSpecializationData());
    dispatch(getAffiliationData());
    dispatch(getDoctorData());
  }, []);

  useEffect(() => {
    const arr =
      specializations.length > 0 &&
      affiliation.length > 0 &&
      doctorsData.length > 0 &&
      doctorsData.map((item, index) => ({
        id: index + 1,
        doctor_id: item.id,
        name_english: item.name_english,
        name_arabic: item.name_arabic,
        email: item.email,
        contact: item.contact,
        SCFHS_license: item.doctor.SCFHS_license,
        MOH_license: item.doctor.MOH_license,
        address: `${item.address.address_line1} ${
          item.address.address_line1 && ","
        } 
        ${item.address.address_line2} ${item.address.address_line2 && ","}
         ${item.address.city}   ${item.address.city && ","}
         ${item.address.state} ${item.address.state && ","} 
         ${item.address.country}`,
        address_line1: item.address.address_line1,
        address_line2: item.address.address_line2,
        state: item.address.state,
        city: item.address.city,
        country: item.address.country,
        zip_code: item.address.zip_code,
        specialization_id: item.doctor.specialization.specialization_id,
        specialization_title:
          specializations[
            specializations.findIndex(
              (specialization) =>
                specialization.id ===
                item.doctor.specialization.specialization_id
            )
          ]?.title,
        affiliation_id: item.doctor.affiliation_id,
        affiliation_title:
          affiliation[
            affiliation.findIndex(
              (affiliations) => affiliations.id === item.doctor.affiliation_id
            )
          ]?.title,
        date: moment(item.created_at).format("YYYY-MM-DD"),
        status_id: item.status,
      }));
    setDoctorData(arr);
  }, [doctorsData, specializations, affiliation]);

  const handleClose = () => {
    dispatch(doctorModelClose());
  };

  const handleClickOpen = () => {
    dispatch(doctorModelOpen());
    setCurrentRow(initialValues);
  };

  const doctorColumn = [
    {
      field: "id",
      headerName: "ID",
      headerClassName: "super-app-theme--header",
      width: 90,
    },
    {
      field: "name_english",
      headerName: "Name(English)",
      headerClassName: "super-app-theme--header",
      width: 150,
    },
    {
      field: "name_arabic",
      headerName: "Name(Arabic)",
      headerClassName: "super-app-theme--header",
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      headerClassName: "super-app-theme--header",
      width: 150,
    },
    {
      field: "contact",
      headerName: "Contact",
      headerClassName: "super-app-theme--header",
      width: 150,
    },
    {
      field: "specialization_title",
      headerName: "Specialization",
      headerClassName: "super-app-theme--header",
      width: 150,
    },
    {
      field: "affiliation_title",
      headerName: "Affiliation",
      headerClassName: "super-app-theme--header",
      width: 150,
    },
    {
      field: "SCFHS_license",
      headerName: "SCFHS License",
      headerClassName: "super-app-theme--header",
      width: 150,
    },
    {
      field: "MOH_license",
      headerName: "MOH License",
      headerClassName: "super-app-theme--header",
      width: 150,
    },
    {
      field: "address",
      headerName: "Address",
      headerClassName: "super-app-theme--header",
      width: 300,
    },
    {
      field: "zip_code",
      headerName: "Zip Code",
      headerClassName: "super-app-theme--header",
      width: 150,
    },

    {
      field: "date",
      headerName: "Date",
      headerClassName: "super-app-theme--header",
      width: 150,
    },
    {
      field: "action",
      headerName: "Action",
      headerClassName: "super-app-theme--header",
      width: 100,
      renderCell: ({ row }) => (
        <strong>
          <Iconify icon="akar-icons:edit" onClick={handleEditClick(row)} />
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Iconify
            icon="ant-design:delete-outlined"
            onClick={handleDeleteClick(row)}
          />
        </strong>
      ),
    },
  ];

  const onDelete = (row) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    dispatch(deleteDoctorData(row.doctor_id));
  };

  const handleDeleteClick = (row) => (event) => {
    event.stopPropagation();
    setConfirmDialog({
      isOpen: true,
      title: "Are you sure to delete this record?",
      subTitle: "You can't undo this operation",
      onConfirm: () => {
        onDelete(row);
      },
    });
  };

  const handleEditClick = (row) => (event) => {
    event.stopPropagation();
    const obj = {
      id: row.specialization_id,
      title: row.specialization_title,
    };
    setCurrentRow({
      name_english: row.name_english
        ? row.name_english
        : initialValues.first_name,
      name_arabic: row.name_arabic ? row.name_arabic : initialValues.last_name,
      email: row.email ? row.email : initialValues.email,
      password: row.password ? row.password : initialValues.password,
      contact: row.contact ? row.contact : initialValues.contact,
      SCFHS_license: row.SCFHS_license
        ? row.SCFHS_license
        : initialValues.SCFHS_license,
      MOH_license: row.MOH_license
        ? row.MOH_license
        : initialValues.MOH_license,
      address: row.address ? row.address : initialValues.address,
      address_line1: row.address_line1,
      address_line2: row.address_line2,
      city: row.city,
      state: row.state,
      country: row.country,
      zip_code: row.zip_code ? row.zip_code : initialValues.zip_code,
      specialization_title: row.specialization_id
        ? row.specialization_id
        : initialValues.specialization_id,
      affiliation_title: row.affiliation_id
        ? row.affiliation_id
        : initialValues.affiliation_id,
      status_title: row.status_id ? row.status_id : initialValues.status_id,
      date: row.date ? row.date : initialValues.date,
      id: row.id,
      doctor_id: row.doctor_id,
    });
    dispatch(doctorModelOpen());
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchVal(e.target.value.trimStart());
  };

  return (
    <>
      <Layout>
        <div className="page-row">
          <div className="titlebox">
            <h2>Doctors</h2>
            <div className="top-search">
              <form>
                <input
                  type="text"
                  value={searchVal}
                  onChange={handleSearch}
                  placeholder="Search Here"
                />
              </form>
            </div>
          </div>
          <div className="custom-btn-grp">
            <a onClick={handleClickOpen} className="add-btn">
              Add Doctor
            </a>
          </div>
        </div>
        <div className="main-table">
          <Table columns={doctorColumn} rows={filteredData} />
        </div>
        {isModelOpen && (
          <DoctorForm handleClose={handleClose} currentRow={currentRow} />
        )}

        <ConfirmDialog
          confirmDialog={confirmDialog}
          setConfirmDialog={setConfirmDialog}
        />
      </Layout>
    </>
  );
};

export default Doctor;





import React, { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { FormProvider, RHFTextField } from "../../../hook-form";
import { Autocomplete, Stack, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addDoctorData, updateDoctorData } from "../../../redux/Doctor/Action";
import { getSpecializationData } from "../../../redux/Specialization/Action";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  arrayReducerFuncTitle,
  checkNullable,
  phoneRegExp,
  valueFunc,
} from "../../../components/Constant";
import AutocompleteSearch from "../../../hook-form/AutocompleteSearch";
import { getAffiliationData } from "../../../redux/Affiliation/Action";

const DoctorSchema = Yup.object().shape({
  name_english: Yup.string()
    .required("Name(English) is required")
    .matches(/[^\s*].*[^\s*]/g, "Only blank space is not allowed!"),
  contact: Yup.string()
    .trim("The contact should not include leading and trailing spaces")
    .strict(true)
    .required("Contact is required")
    .matches(phoneRegExp, "Contact number is not valid"),
  email: Yup.string()
    .trim("The Email should not include leading and trailing spaces")
    .strict(true)
    .email("Email must be a valid email address")
    .required("Email is required"),
  affiliation_title: Yup.string().required("Affiliation is required"),
  SCFHS_license: Yup.string().required("SCFHS License is required"),
  MOH_license: Yup.string().required("MOH License is required"),
  zip_code: Yup.string()
    .nullable()
    .notRequired()
    .transform((_, val) => checkNullable(val))
    .matches(/^[0-9]+$/, "Zip Code must be only digits")
    .min(5, "Zip Code must be exactly 5 digits")
    .max(6),
  state: Yup.string()
    .nullable()
    .notRequired()
    .transform((_, val) => checkNullable(val))
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
  country: Yup.string()
    .nullable()
    .notRequired()
    .transform((_, val) => checkNullable(val))
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
  specialization_title: Yup.string().required(
    "Specialization Title is required"
  ),
});

const DoctorForm = ({ handleClose, currentRow }) => {
  const defaultValues = currentRow;
  const dispatch = useDispatch();

  const [data, setData] = useState();
  const [specializationsData, setSpecializationsData] = useState([]);
  const [affiliationData, setAffiliationsData] = useState([]);
  const specializations = useSelector(
    (state) => state.Specialization.specializations
  );
  const affiliation = useSelector((state) => state.Affiliation.Affiliation);

  useEffect(() => {
    const arr = arrayReducerFuncTitle(specializations);
    setSpecializationsData(arr);
  }, [specializations]);

  useEffect(() => {
    const arr = arrayReducerFuncTitle(affiliation);
    setAffiliationsData(arr);
  }, [affiliation]);

  useEffect(() => {
    dispatch(getSpecializationData());
    dispatch(getAffiliationData());
  }, []);

  const methods = useForm({
    resolver: yupResolver(DoctorSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
    control,
  } = methods;

  const onSubmit = (data) => {
    let Data = {
      role_id: 2,
      name_english: data.name_english,
      name_arabic: data.name_arabic,
      email: data.email,
      contact: data.contact,
      affiliation_id: data.affiliation_title,
      specialization_id: data.specialization_title,
      SCFHS_license: data.SCFHS_license,
      MOH_license: data.MOH_license,
      address_line1: data.address_line1,
      address_line2: data.address_line2,
      city: data.city === null ? "" : data.city,
      state: data.state === null ? "" : data.state,
      country: data.country === null ? "" : data.country,
      zip_code: data.zip_code === "" ? null : data.zip_code,
      status: 1,
    };

    if (data.doctor_id) {
      Data.id = data.doctor_id;
      dispatch(updateDoctorData(Data));
    } else {
      dispatch(addDoctorData(Data));
    }
  };

  return (
    <>
      <Modal
        title={currentRow.id ? "Update Doctors" : " Add Doctor "}
        onCancel={handleClose}
        loading={isSubmitting}
      >
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} className="css-1lwbda4-MuiStack-root">
            <RHFTextField
              name="name_english"
              label="Name(English) *"
              autoFocus={true}
            />
            <RHFTextField name="name_arabic" label="Name(Arabic)" />
            <RHFTextField name="email" label="Email *" />
            <RHFTextField
              name="contact"
              label="Contact *"
              placeholder="9665 xxxx xxxx"
            />
            <AutocompleteSearch
              name="specialization_title"
              options={specializationsData}
              label="Specialization *"
              id={currentRow?.specialization_title}
            />
            <AutocompleteSearch
              name="affiliation_title"
              options={affiliationData}
              label="Affiliation *"
              id={currentRow?.affiliation_title}
            />
            <RHFTextField name="SCFHS_license" label="SCFHS License *" />
            <RHFTextField name="MOH_license" label="MOH License *" />
            <RHFTextField name="address_line1" label="Address Line 1" />
            <RHFTextField name="address_line2" label="Address Line 2" />
            <RHFTextField name="city" label="City" />
            <RHFTextField name="zip_code" label="Zip Code" />
            <RHFTextField name="state" label="State" />
            <RHFTextField name="country" label="Country" />
          </Stack>
          <div className="model-footer">
            <button
              type="cancel"
              onClick={handleClose}
              className="cancel-btn border-btn"
            >
              Cancel
            </button>
            <button type="cancel" className="Save-btn cmn-btn">
              {currentRow.id ? "Update" : "Save"}
            </button>
          </div>
        </FormProvider>
      </Modal>
    </>
  );
};

export default DoctorForm;






{/* card */}

<div class="row">

<div class="col-lg-3 col-md-6 d-flex">
  <div class="card flex-fill">
    <div class="card-body d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center overflow-hidden">
        <span class="avatar avatar-lg bg-primary flex-shrink-0">
          <i class="ti ti-building fs-16"></i>
        </span>
        <div class="ms-2 overflow-hidden">
          <p class="fs-12 fw-medium mb-1 text-truncate">Total Companies</p>
          <h4>950</h4>
        </div>
      </div>
  </div>
</div>
</div>

<div class="col-lg-3 col-md-6 d-flex">
  <div class="card flex-fill">
    <div class="card-body d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center overflow-hidden">
        <span class="avatar avatar-lg bg-success flex-shrink-0">
          <i class="ti ti-building fs-16"></i>
        </span>
        <div class="ms-2 overflow-hidden">
          <p class="fs-12 fw-medium mb-1 text-truncate">Active Companies</p>
          <h4>920</h4>
        </div>
      </div>

  </div>
</div>

<div class="col-lg-3 col-md-6 d-flex">
  <div class="card flex-fill">
    <div class="card-body d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center overflow-hidden">
        <span class="avatar avatar-lg bg-danger flex-shrink-0">
          <i class="ti ti-building fs-16"></i>
        </span>
        <div class="ms-2 overflow-hidden">
          <p class="fs-12 fw-medium mb-1 text-truncate">Inactive Companies</p>
          <h4>30</h4>
        </div>
      </div>
   
  </div>
</div>
</div>


<div class="col-lg-3 col-md-6 d-flex">
  <div class="card flex-fill">
    <div class="card-body d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center overflow-hidden">
        <span class="avatar avatar-lg bg-skyblue flex-shrink-0">
          <i class="ti ti-map-pin-check fs-16"></i>
        </span>
        <div class="ms-2 overflow-hidden">
          <p class="fs-12 fw-medium mb-1 text-truncate">Company Location</p>
          <h4>180</h4>
        </div>
      </div>
      
  </div>
</div>

</div>

</div>

</div>


{/* above */}


<div class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
					<div class="my-auto mb-2">
						<h2 class="mb-1">Companies</h2>
						<nav>
							<ol class="breadcrumb mb-0">
								<li class="breadcrumb-item">
									<a href="index.html"><i class="ti ti-smart-home"></i></a>
								</li>
								<li class="breadcrumb-item">
									Application
								</li>
								<li class="breadcrumb-item active" aria-current="page">Companies List</li>
							</ol>
						</nav>
					</div>
					<div class="d-flex my-xl-auto right-content align-items-center flex-wrap ">
						<div class="me-2 mb-2">
							<div class="dropdown">
								<a href="javascript:void(0);" class="dropdown-toggle btn btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown" aria-expanded="false">
									<i class="ti ti-file-export me-1"></i>Export
								</a>
								<ul class="dropdown-menu dropdown-menu-end p-3" style="">
									<li>
										<a href="javascript:void(0);" class="dropdown-item rounded-1"><i class="ti ti-file-type-pdf me-1"></i>Export as PDF</a>
									</li>
									<li>
										<a href="javascript:void(0);" class="dropdown-item rounded-1"><i class="ti ti-file-type-xls me-1"></i>Export as Excel </a>
									</li>
								</ul>
							</div>
						</div>
						<div class="mb-2">
							<a href="#" data-bs-toggle="modal" data-bs-target="#add_company" class="btn btn-primary d-flex align-items-center"><i class="ti ti-circle-plus me-2"></i>Add Company</a>
						</div>
						<div class="ms-2 head-icons">
							<a href="javascript:void(0);" class="" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-original-title="Collapse" id="collapse-header">
								<i class="ti ti-chevrons-up"></i>
							</a>
						</div>
					</div>
</div>


{/* Companies List table */}

<div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
						<h5>Companies List</h5>
						<div class="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
							<div class="me-3">
								<div class="input-icon-end position-relative">
									<input type="text" class="form-control date-range bookingrange" placeholder="dd/mm/yyyy - dd/mm/yyyy">
									<span class="input-icon-addon">
										<i class="ti ti-chevron-down"></i>
									</span>
								</div>
							</div>
							<div class="dropdown me-3">
								<a href="javascript:void(0);" class="dropdown-toggle btn btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown" aria-expanded="false">
									Select Plan
								</a>
								<ul class="dropdown-menu dropdown-menu-end p-3" style="">
									<li>
										<a href="javascript:void(0);" class="dropdown-item rounded-1">Advanced</a>
									</li>
									<li>
										<a href="javascript:void(0);" class="dropdown-item rounded-1">Basic</a>
									</li>
									<li>
										<a href="javascript:void(0);" class="dropdown-item rounded-1">Enterprise</a>
									</li>
								</ul>
							</div>
							<div class="dropdown me-3">
								<a href="javascript:void(0);" class="dropdown-toggle btn btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown" aria-expanded="false">
									Select Status
								</a>
								<ul class="dropdown-menu dropdown-menu-end p-3" style="">
									<li>
										<a href="javascript:void(0);" class="dropdown-item rounded-1">Active</a>
									</li>
									<li>
										<a href="javascript:void(0);" class="dropdown-item rounded-1">Inactive</a>
									</li>
								</ul>
							</div>
							<div class="dropdown">
								<a href="javascript:void(0);" class="dropdown-toggle btn btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown" aria-expanded="false">
									Sort By : Last 7 Days
								</a>
								<ul class="dropdown-menu dropdown-menu-end p-3" style="">
									<li>
										<a href="javascript:void(0);" class="dropdown-item rounded-1">Recently Added</a>
									</li>
									<li>
										<a href="javascript:void(0);" class="dropdown-item rounded-1">Ascending</a>
									</li>
									<li>
										<a href="javascript:void(0);" class="dropdown-item rounded-1">Desending</a>
									</li>
									<li>
										<a href="javascript:void(0);" class="dropdown-item rounded-1">Last Month</a>
									</li>
									<li>
										<a href="javascript:void(0);" class="dropdown-item rounded-1">Last 7 Days</a>
									</li>
								</ul>
							</div>
						</div>
					</div>



{/* modal */}


          <div class="modal fade show" id="delete_modal" style="display: block;" aria-modal="true" role="dialog">
			<div class="modal-dialog modal-dialog-centered modal-sm">
				<div class="modal-content">
					<div class="modal-body text-center">
						<span class="avatar avatar-xl bg-transparent-danger text-danger mb-3">
							<i class="ti ti-trash-x fs-36"></i>
						</span>
						<h4 class="mb-1">Confirm Delete</h4>
						<p class="mb-3">You want to delete all the marked items, this cant be undone once you delete.</p>
						<div class="d-flex justify-content-center">
							<a href="javascript:void(0);" class="btn btn-light me-3" data-bs-dismiss="modal">Cancel</a>
							<a href="companies.html" class="btn btn-danger">Yes, Delete</a>
						</div>
					</div>
				</div>
			</div>
		</div>