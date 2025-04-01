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
