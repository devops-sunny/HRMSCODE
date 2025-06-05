import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FormProvider from "../../../hook-form/FormProvider";
import RHFCheckbox from "../../../hook-form/RHFCheckbox";
import RHFDatePicker from "../../../hook-form/RHFDatePicker";
import RHFFileUpload from "../../../hook-form/RHFFileUpload";
import RHFSelect from "../../../hook-form/RHFSelect";
import RHFTextField from "../../../hook-form/RHFTextField";
import {
  birthCertificateRegistrationPostData,
  birthUpdatePostData,
  hospitalsUpdatePostData,
} from "../../../services/birthCertificateRegistration/birthCertificateRegistrationServices";
import {
  CityAPI,
  CountryAPI,
  DistrictAPI,
  EducationAPI,
  getBirthPlacesAPI,
  NationalityAPI,
  ReligionAPI,
  stateAPI,
  TehsilAPI,
  OccupationAPI,
} from "../../../services/Master/Master";
import birthStore from "../../../store/birth-store";
import { validationSchema } from "./validationSchema";
import { download } from "../../../services/Table/TableServices";
import moment from "moment";
import { base64ToBlob } from "../../../utils/string";



// Birth Registration Form Interface
export interface BirthRegistrationForm {
  // 1. Child's Date of Birth
  childDateOfBirth: string;

  // 2. Sex (Gender ID: 1 = Male, 2 = Female, 3 = Transgender)
  childGenderId: number | null;

  // 3. Child's Full Name and Aadhaar
  childName: string;
  childAadhaarNumber: string;

  // 4. Father's Details
  fatherName: string;
  fatherAadhaarNumber: string;
  fatherMobileNumber: string;
  fatherEmailId: string;

  // 5. Mother's Details
  motherName: string;
  motherAadhaarNumber: string;
  motherMobileNumber: string;
  motherEmailId: string;

  // 6. Address of Parents at the time of Birth
  parentAddressAtBirthTimeLocality: string;
  parentAddressAtBirthTimeWardNumber: string;
  parentAddressAtBirthTimeTownVillageId: string;
  parentAddressAtBirthTimeSubdistrictId: string;
  parentAddressAtBirthTimeDistrictId: string;
  parentAddressAtBirthTimeStateUtId: string;
  parentAddressAtBirthTimePincode: number | null;

  // 7. Permanent Address of Parents
  permanentAddressOfParentLocality: string;
  permanentAddressOfParentWardNumber: string;
  permanentAddressOfParentTownVillageId: string;
  permanentAddressOfParentSubdistrictId: string;
  permanentAddressOfParentDistrictId: string;
  permanentAddressOfParentStateUtId: string;
  permanentAddressOfParentPincode: number | null;

  // 8. Place of Birth
  placeOfBirthId: string; // '1' = Hospital, '2' = House, '3' = Other
  hospitalId: number | null; // Only applicable if placeOfBirthId = 1

  // 8.2 Address where birth took place
  placeOfBirthHouseNo: string;
  placeOfBirthLocality: string;
  placeOfBirthWardNumber: string;
  placeOfBirthTownVillageId: string;
  placeOfBirthSubdistrictId: string;
  placeOfBirthDistrictId: string;
  placeOfBirthStateUtId: string;
  placeOfBirthPincode: number | null;

  // 9. Informant Details
  informantsName: string;
  informantsAadhaarNumber: string;
  informantsMobileNumber: string;
  informantsEmailId: string;
  informantsHouseNo: string;
  informantsLocality: string;
  informantsWardNumber: string;
  informantsTownVillageId: string;
  informantsSubdistrictId: string;
  informantsDistrictId: string;
  informantsStateUtId: string;
  informantsPincode: number | null;

  // 10. Residence of the mother (town/village)
  residenceOfMotherTownVillage: string;
  residenceOfMotherSubdistrictId: string;
  residenceOfMotherDistrictId: string;
  residenceOfMotherStateUtId: string;
  residenceOfMotherPincode: number | null;

  // 11. Religion (dropdown or mapped ID)
  fatherReligionId: number | null;
  motherReligionId: number | null;

  // 12 & 13. Education
  fatherEducationId: number | null;
  motherEducationId: number | null;

  // 14 & 15. Occupation
  fatherOccupationId: number | null;
  motherOccupationId: number | null;

  // 16. Mother's age at time of marriage (in completed years)
  motherAgeAtTimeOfMarriage: number | null;

  // 17. Mother's age at time of birth (in completed years)
  motherAgeAtTimeOfBirth: number | null;

  // 18. Number of children born alive to the mother so far
  numberOfChildren: number | null;

  // 19. Type of attention at delivery
  // 1 = Institutional-Government, 2 = Institutional-Private, 3 = Doctor/Nurse, 4 = Traditional Attendant, 5 = Relatives/Others
  typeOfAttentionId: number | null;

  // 20. Method of Delivery
  // 1 = Natural, 2 = Caesarean, 3 = Forceps/Vacuum
  methodOfDeliveryId: number | null;

  // 21. Birth Weight (if available)
  childBirthWeight: string;

  // 22. Duration of pregnancy (in weeks)
  durationOfPregnancy: string;

  // Declaration checkbox
  declaration: boolean;
}



const defaultValues: BirthRegistrationForm = {
  childDateOfBirth: "",
  childGenderId: null,
  childName: "",
  childAadhaarNumber: "",
  
  fatherName: "",
  fatherAadhaarNumber: "",
  fatherMobileNumber: "",
  fatherEmailId: "",
  
  motherName: "",
  motherAadhaarNumber: "",
  motherMobileNumber: "",
  motherEmailId: "",
  
  parentAddressAtBirthTimeLocality: "",
  parentAddressAtBirthTimeWardNumber: "",
  parentAddressAtBirthTimeTownVillageId: "",
  parentAddressAtBirthTimeSubdistrictId: "",
  parentAddressAtBirthTimeDistrictId: "",
  parentAddressAtBirthTimeStateUtId: "",
  parentAddressAtBirthTimePincode: null,
  
  permanentAddressOfParentLocality: "",
  permanentAddressOfParentWardNumber: "",
  permanentAddressOfParentTownVillageId: "",
  permanentAddressOfParentSubdistrictId: "",
  permanentAddressOfParentDistrictId: "",
  permanentAddressOfParentStateUtId: "",
  permanentAddressOfParentPincode: null,
  
  placeOfBirthId: "",
  hospitalId: null,
  
  placeOfBirthHouseNo: "",
  placeOfBirthLocality: "",
  placeOfBirthWardNumber: "",
  placeOfBirthTownVillageId: "",
  placeOfBirthSubdistrictId: "",
  placeOfBirthDistrictId: "",
  placeOfBirthStateUtId: "",
  placeOfBirthPincode: null,
  
  informantsName: "",
  informantsAadhaarNumber: "",
  informantsMobileNumber: "",
  informantsEmailId: "",
  informantsHouseNo: "",
  informantsLocality: "",
  informantsWardNumber: "",
  informantsTownVillageId: "",
  informantsSubdistrictId: "",
  informantsDistrictId: "",
  informantsStateUtId: "",
  informantsPincode: null,
  
  residenceOfMotherTownVillage: "",
  residenceOfMotherSubdistrictId: "",
  residenceOfMotherDistrictId: "",
  residenceOfMotherStateUtId: "",
  residenceOfMotherPincode: null,
  
  fatherReligionId: null,
  motherReligionId: null,
  
  fatherEducationId: null,
  motherEducationId: null,
  
  fatherOccupationId: null,
  motherOccupationId: null,
  
  motherAgeAtTimeOfMarriage: null,
  motherAgeAtTimeOfBirth: null,
  numberOfChildren: null,
  
  typeOfAttentionId: null,
  methodOfDeliveryId: null,
  
  childBirthWeight: "",
  durationOfPregnancy: "",
  
  declaration: false,
};

const BirthRegistrationFormComponent = () => {
  const navigate = useNavigate();
  const { birthData, clearUserStore } = birthStore();
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // State for address dropdowns - Parent Address at Birth Time
  const [parentBirthTimeState, setParentBirthTimeState] = useState("");
  const [parentBirthTimeDistrict, setParentBirthTimeDistrict] = useState("");
  const [parentBirthTimeTehsil, setParentBirthTimeTehsil] = useState("");
  
  // State for address dropdowns - Permanent Address
  const [permanentAddressState, setPermanentAddressState] = useState("");
  const [permanentAddressDistrict, setPermanentAddressDistrict] = useState("");
  const [permanentAddressTehsil, setPermanentAddressTehsil] = useState("");
  
  // State for address dropdowns - Place of Birth
  const [placeOfBirthState, setPlaceOfBirthState] = useState("");
  const [placeOfBirthDistrict, setPlaceOfBirthDistrict] = useState("");
  const [placeOfBirthTehsil, setPlaceOfBirthTehsil] = useState("");
  
  // State for address dropdowns - Informant Address
  const [informantState, setInformantState] = useState("");
  const [informantDistrict, setInformantDistrict] = useState("");
  const [informantTehsil, setInformantTehsil] = useState("");
  
  // State for address dropdowns - Mother's Residence
  const [motherResidenceState, setMotherResidenceState] = useState("");
  const [motherResidenceDistrict, setMotherResidenceDistrict] = useState("");
  const [motherResidenceTehsil, setMotherResidenceTehsil] = useState("");
  
  const [sameAsPermanentAddress, setSameAsPermanentAddress] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const methods = useForm<BirthRegistrationForm>({
    resolver: yupResolver(validationSchema),
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    reset,
    setValue,
  } = methods;

  // API Queries for master data
  const { data: stateData } = useQuery({
    queryFn: stateAPI,
    queryKey: ["stateData"],
  });

  const { data: religionData } = useQuery({
    queryFn: ReligionAPI,
    queryKey: ["religionData"],
  });

  const { data: educationData } = useQuery({
    queryFn: EducationAPI,
    queryKey: ["educationData"],
  });

  const { data: occupationData } = useQuery({
    queryFn: OccupationAPI,
    queryKey: ["occupationData"],
  });

  const { data: hospitalData } = useQuery({
    queryFn: hospitalsUpdatePostData,
    queryKey: ["hospitalData"],
  });

  const { data: birthPlacesData } = useQuery({
    queryFn: getBirthPlacesAPI,
    queryKey: ["birthPlacesData"],
  });

  // District queries for different address sections
  const { data: parentBirthTimeDistrictData } = useQuery({
    queryFn: () => {
      if (parentBirthTimeState !== "") {
        return DistrictAPI({ id: parentBirthTimeState });
      }
    },
    queryKey: ["parentBirthTimeDistrictData", parentBirthTimeState],
  });

  const { data: permanentAddressDistrictData } = useQuery({
    queryFn: () => {
      if (permanentAddressState !== "") {
        return DistrictAPI({ id: permanentAddressState });
      }
    },
    queryKey: ["permanentAddressDistrictData", permanentAddressState],
  });

  const { data: placeOfBirthDistrictData } = useQuery({
    queryFn: () => {
      if (placeOfBirthState !== "") {
        return DistrictAPI({ id: placeOfBirthState });
      }
    },
    queryKey: ["placeOfBirthDistrictData", placeOfBirthState],
  });

  const { data: informantDistrictData } = useQuery({
    queryFn: () => {
      if (informantState !== "") {
        return DistrictAPI({ id: informantState });
      }
    },
    queryKey: ["informantDistrictData", informantState],
  });

  const { data: motherResidenceDistrictData } = useQuery({
    queryFn: () => {
      if (motherResidenceState !== "") {
        return DistrictAPI({ id: motherResidenceState });
      }
    },
    queryKey: ["motherResidenceDistrictData", motherResidenceState],
  });

  // Tehsil queries for different address sections
  const { data: parentBirthTimeTehsilData } = useQuery({
    queryFn: () => {
      if (parentBirthTimeDistrict !== "" && parentBirthTimeState !== "") {
        return TehsilAPI({ dtcode11: parentBirthTimeDistrict, stcode11: parentBirthTimeState });
      }
    },
    queryKey: ["parentBirthTimeTehsilData", parentBirthTimeState, parentBirthTimeDistrict],
  });

  const { data: permanentAddressTehsilData } = useQuery({
    queryFn: () => {
      if (permanentAddressDistrict !== "" && permanentAddressState !== "") {
        return TehsilAPI({ dtcode11: permanentAddressDistrict, stcode11: permanentAddressState });
      }
    },
    queryKey: ["permanentAddressTehsilData", permanentAddressState, permanentAddressDistrict],
  });

  const { data: placeOfBirthTehsilData } = useQuery({
    queryFn: () => {
      if (placeOfBirthDistrict !== "" && placeOfBirthState !== "") {
        return TehsilAPI({ dtcode11: placeOfBirthDistrict, stcode11: placeOfBirthState });
      }
    },
    queryKey: ["placeOfBirthTehsilData", placeOfBirthState, placeOfBirthDistrict],
  });

  const { data: informantTehsilData } = useQuery({
    queryFn: () => {
      if (informantDistrict !== "" && informantState !== "") {
        return TehsilAPI({ dtcode11: informantDistrict, stcode11: informantState });
      }
    },
    queryKey: ["informantTehsilData", informantState, informantDistrict],
  });

  const { data: motherResidenceTehsilData } = useQuery({
    queryFn: () => {
      if (motherResidenceDistrict !== "" && motherResidenceState !== "") {
        return TehsilAPI({ dtcode11: motherResidenceDistrict, stcode11: motherResidenceState });
      }
    },
    queryKey: ["motherResidenceTehsilData", motherResidenceState, motherResidenceDistrict],
  });

  // City queries for different address sections
  const { data: parentBirthTimeCityData } = useQuery({
    queryFn: () => {
      if (parentBirthTimeState !== "" && parentBirthTimeDistrict !== "" && parentBirthTimeTehsil !== "") {
        return CityAPI({
          st_2011: parentBirthTimeState,
          dt_2011: parentBirthTimeDistrict,
          sdt_2011: parentBirthTimeTehsil,
        });
      }
    },
    queryKey: ["parentBirthTimeCityData", parentBirthTimeTehsil],
  });

  const { data: permanentAddressCityData } = useQuery({
    queryFn: () => {
      if (permanentAddressState !== "" && permanentAddressDistrict !== "" && permanentAddressTehsil !== "") {
        return CityAPI({
          st_2011: permanentAddressState,
          dt_2011: permanentAddressDistrict,
          sdt_2011: permanentAddressTehsil,
        });
      }
    },
    queryKey: ["permanentAddressCityData", permanentAddressTehsil],
  });

  const { data: placeOfBirthCityData } = useQuery({
    queryFn: () => {
      if (placeOfBirthState !== "" && placeOfBirthDistrict !== "" && placeOfBirthTehsil !== "") {
        return CityAPI({
          st_2011: placeOfBirthState,
          dt_2011: placeOfBirthDistrict,
          sdt_2011: placeOfBirthTehsil,
        });
      }
    },
    queryKey: ["placeOfBirthCityData", placeOfBirthTehsil],
  });

  const { data: informantCityData } = useQuery({
    queryFn: () => {
      if (informantState !== "" && informantDistrict !== "" && informantTehsil !== "") {
        return CityAPI({
          st_2011: informantState,
          dt_2011: informantDistrict,
          sdt_2011: informantTehsil,
        });
      }
    },
    queryKey: ["informantCityData", informantTehsil],
  });

  const { data: motherResidenceCityData } = useQuery({
    queryFn: () => {
      if (motherResidenceState !== "" && motherResidenceDistrict !== "" && motherResidenceTehsil !== "") {
        return CityAPI({
          st_2011: motherResidenceState,
          dt_2011: motherResidenceDistrict,
          sdt_2011: motherResidenceTehsil,
        });
      }
    },
    queryKey: ["motherResidenceCityData", motherResidenceTehsil],
  });

  // Handle same as permanent address checkbox
  const handleSameAsPermanentAddress = (checked: boolean) => {
    setSameAsPermanentAddress(checked);
    if (checked) {
      setValue("parentAddressAtBirthTimeLocality", watch("permanentAddressOfParentLocality"));
      setValue("parentAddressAtBirthTimeWardNumber", watch("permanentAddressOfParentWardNumber"));
      setValue("parentAddressAtBirthTimeTownVillageId", watch("permanentAddressOfParentTownVillageId"));
      setValue("parentAddressAtBirthTimeSubdistrictId", watch("permanentAddressOfParentSubdistrictId"));
      setValue("parentAddressAtBirthTimeDistrictId", watch("permanentAddressOfParentDistrictId"));
      setValue("parentAddressAtBirthTimeStateUtId", watch("permanentAddressOfParentStateUtId"));
      setValue("parentAddressAtBirthTimePincode", watch("permanentAddressOfParentPincode"));
      
      setParentBirthTimeState(permanentAddressState);
      setParentBirthTimeDistrict(permanentAddressDistrict);
      setParentBirthTimeTehsil(permanentAddressTehsil);
    } else {
      setValue("parentAddressAtBirthTimeLocality", "");
      setValue("parentAddressAtBirthTimeWardNumber", "");
      setValue("parentAddressAtBirthTimeTownVillageId", "");
      setValue("parentAddressAtBirthTimeSubdistrictId", "");
      setValue("parentAddressAtBirthTimeDistrictId", "");
      setValue("parentAddressAtBirthTimeStateUtId", "");
      setValue("parentAddressAtBirthTimePincode", null);
      
      setParentBirthTimeState("");
      setParentBirthTimeDistrict("");
      setParentBirthTimeTehsil("");
    }
  };

  const { mutate: postBirthCertificateData } = useMutation({
    mutationFn: birthCertificateRegistrationPostData,
    onSuccess: (res: any) => {
      toast("Data saved successfully!");
      reset();
      setTimeout(() => {
        setShowSuccess(true);
        setIsSubmitDisabled(false);
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      }, 1000);
    },
    onError: (error) => {
      console.error("Error saving birth registration data:", error);
      toast.error("Error saving data. Please try again.");
    },
  });

  const onSubmit = (data: BirthRegistrationForm) => {
    console.log("Birth registration data:", data);
    postBirthCertificateData(data);
    clearUserStore();
  };

  const handleConfirmSubmit = () => {
    setShowConfirmation(true);
  };

  const confirmSubmit = () => {
    setShowConfirmation(false);
    handleSubmit(onSubmit)();
  };

  const genderOptions = [
    { value: 1, label: "Male" },
    { value: 2, label: "Female" },
    { value: 3, label: "Transgender" }
  ];

  const placeOfBirthOptions = [
    { value: "1", label: "Hospital" },
    { value: "2", label: "House" },
    { value: "3", label: "Other" }
  ];

  const typeOfAttentionOptions = [
    { value: 1, label: "Institutional-Government" },
    { value: 2, label: "Institutional-Private" },
    { value: 3, label: "Doctor/Nurse" },
    { value: 4, label: "Traditional Attendant" },
    { value: 5, label: "Relatives/Others" }
  ];

  const methodOfDeliveryOptions = [
    { value: 1, label: "Natural" },
    { value: 2, label: "Caesarean" },
    { value: 3, label: "Forceps/Vacuum" }
  ];

  useEffect(() => {
    setDate(moment().format("YYYY-MM-DD"));
  }, []);

  return (
  
   <>
      <div className="card">
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          
          {/* Child Information Section */}
          <div className="border-bottom mb-3">
            <h4 className="mb-3">Child Information</h4>
            <div className="row">
              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Child's Date of Birth *</label>
                  </div>
                  <div className="col-md-8">
                    <RHFDatePicker
                      name="childDateOfBirth"
                      label="Child's Date of Birth"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Sex *</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      name="childGenderId"
                      label="Sex"
                      className="form-control"
                      options={genderOptions}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Child's Full Name *</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="childName"
                      label="Child's Full Name"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Child's Aadhaar Number</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="childAadhaarNumber"
                      label="Child's Aadhaar Number"
                      type="number"
                      maxlength={12}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Father's Details Section */}
          <div className="border-bottom mb-3">
            <h4 className="mb-3">Father's Details</h4>
            <div className="row">
              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Father's Name *</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="fatherName"
                      label="Father's Name"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Father's Aadhaar *</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="fatherAadhaarNumber"
                      label="Father's Aadhaar Number"
                      type="number"
                      maxlength={12}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Father's Mobile *</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="fatherMobileNumber"
                      label="Father's Mobile Number"
                      type="number"
                      maxlength={10}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Father's Email</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="fatherEmailId"
                      label="Father's Email ID"
                      type="email"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Father's Religion</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      name="fatherReligionId"
                      label="Father's Religion"
                      className="form-control"
                      options={(religionData && religionData) || []}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Father's Education</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      name="fatherEducationId"
                      label="Father's Education"
                      className="form-control"
                      options={(educationData && educationData) || []}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Father's Occupation</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      name="fatherOccupationId"
                      label="Father's Occupation"
                      className="form-control"
                      options={(occupationData && occupationData) || []}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mother's Details Section */}
          <div className="border-bottom mb-3">
            <h4 className="mb-3">Mother's Details</h4>
            <div className="row">
              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Mother's Name *</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="motherName"
                      label="Mother's Name"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Mother's Aadhaar *</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="motherAadhaarNumber"
                      label="Mother's Aadhaar Number"
                      type="number"
                      maxlength={12}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Mother's Mobile *</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="motherMobileNumber"
                      label="Mother's Mobile Number"
                      type="number"
                      maxlength={10}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Mother's Email</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="motherEmailId"
                      label="Mother's Email ID"
                      type="email"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Mother's Religion</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      name="motherReligionId"
                      label="Mother's Religion"
                      className="form-control"
                      options={(religionData && religionData) || []}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Mother's Education</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      name="motherEducationId"
                      label="Mother's Education"
                      className="form-control"
                      options={(educationData && educationData) || []}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Mother's Occupation</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      name="motherOccupationId"
                      label="Mother's Occupation"
                      className="form-control"
                      options={(occupationData && occupationData) || []}
                    />
                  </div>
                </div>
              </div>




                    <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Mother's Age at Marriage</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="motherAgeAtTimeOfMarriage"
                      label="Mother's Age at Marriage"
                      type="number"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Mother's Age at Birth</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="motherAgeAtTimeOfBirth"
                      label="Mother's Age at Birth"
                      type="number"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Number of Children</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="numberOfChildren"
                      label="Number of Children"
                      type="number"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mother's Residence Section */}
          <div className="border-bottom mb-3">
            <h4 className="mb-3">Mother's Residence</h4>
            <div className="row">
              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Town/Village</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="residenceOfMotherTownVillage"
                      label="Mother's Residence Town/Village"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">State</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      name="residenceOfMotherStateUtId"
                      label="Mother's Residence State"
                      className="form-control"
                      options={(stateData && stateData) || []}
                      onChange={(e) => {
                        setMotherResidenceState(e.target.value);
                        setValue("residenceOfMotherDistrictId", "");
                        setValue("residenceOfMotherSubdistrictId", "");
                        setMotherResidenceDistrict("");
                        setMotherResidenceTehsil("");
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">District</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      name="residenceOfMotherDistrictId"
                      label="Mother's Residence District"
                      className="form-control"
                      options={(motherResidenceDistrictData && motherResidenceDistrictData) || []}
                      onChange={(e) => {
                        setMotherResidenceDistrict(e.target.value);
                        setValue("residenceOfMotherSubdistrictId", "");
                        setMotherResidenceTehsil("");
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Sub-district</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      name="residenceOfMotherSubdistrictId"
                      label="Mother's Residence Sub-district"
                      className="form-control"
                      options={(motherResidenceTehsilData && motherResidenceTehsilData) || []}
                      onChange={(e) => {
                        setMotherResidenceTehsil(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Pincode</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="residenceOfMotherPincode"
                      label="Mother's Residence Pincode"
                      type="number"
                      maxlength={6}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Permanent Address of Parents Section */}
          <div className="border-bottom mb-3">
            <h4 className="mb-3">Permanent Address of Parents</h4>
            <div className="row">
              <div className="col-md-12 mb-3">
                <RHFCheckbox
                  name="sameAsPermanentAddress"
                  label="Same as above address"
                  onChange={(e) => handleSameAsPermanentAddress(e.target.checked)}
                />
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Locality</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="permanentAddressOfParentLocality"
                      label="Permanent Address Locality"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Ward Number</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="permanentAddressOfParentWardNumber"
                      label="Permanent Address Ward Number"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">State</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      name="permanentAddressOfParentStateUtId"
                      label="Permanent Address State"
                      className="form-control"
                      options={(stateData && stateData) || []}
                      onChange={(e) => {
                        setPermanentAddressState(e.target.value);
                        setValue("permanentAddressOfParentDistrictId", "");
                        setValue("permanentAddressOfParentSubdistrictId", "");
                        setValue("permanentAddressOfParentTownVillageId", "");
                        setPermanentAddressDistrict("");
                        setPermanentAddressTehsil("");
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">District</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      name="permanentAddressOfParentDistrictId"
                      label="Permanent Address District"
                      className="form-control"
                      options={(permanentAddressDistrictData && permanentAddressDistrictData) || []}
                      onChange={(e) => {
                        setPermanentAddressDistrict(e.target.value);
                        setValue("permanentAddressOfParentSubdistrictId", "");
                        setValue("permanentAddressOfParentTownVillageId", "");
                        setPermanentAddressTehsil("");
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Sub-district</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      name="permanentAddressOfParentSubdistrictId"
                      label="Permanent Address Sub-district"
                      className="form-control"
                      options={(permanentAddressTehsilData && permanentAddressTehsilData) || []}
                      onChange={(e) => {
                        setPermanentAddressTehsil(e.target.value);
                        setValue("permanentAddressOfParentTownVillageId", "");
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Town/Village</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      name="permanentAddressOfParentTownVillageId"
                      label="Permanent Address Town/Village"
                      className="form-control"
                      options={(permanentAddressCityData && permanentAddressCityData) || []}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Pincode</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="permanentAddressOfParentPincode"
                      label="Permanent Address Pincode"
                      type="number"
                      maxlength={6}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Parent Address at Birth Time Section */}
          <div className="border-bottom mb-3">
            <h4 className="mb-3">Parent Address at Birth Time</h4>
            <div className="row">
              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Locality</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="parentAddressAtBirthTimeLocality"
                      label="Birth Time Address Locality"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Ward Number</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="parentAddressAtBirthTimeWardNumber"
                      label="Birth Time Address Ward Number"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">State</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      name="parentAddressAtBirthTimeStateUtId"
                      label="Birth Time Address State"
                      className="form-control"
                      options={(stateData && stateData) || []}
                      onChange={(e) => {
                        setParentBirthTimeState(e.target.value);
                        setValue("parentAddressAtBirthTimeDistrictId", "");
                        setValue("parentAddressAtBirthTimeSubdistrictId", "");
                        setValue("parentAddressAtBirthTimeTownVillageId", "");
                        setParentBirthTimeDistrict("");
                        setParentBirthTimeTehsil("");
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">District</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      name="parentAddressAtBirthTimeDistrictId"
                      label="Birth Time Address District"
                      className="form-control"
                      options={(parentBirthTimeDistrictData && parentBirthTimeDistrictData) || []}
                      onChange={(e) => {
                        setParentBirthTimeDistrict(e.target.value);
                        setValue("parentAddressAtBirthTimeSubdistrictId", "");
                        setValue("parentAddressAtBirthTimeTownVillageId", "");
                        setParentBirthTimeTehsil("");
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Sub-district</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      name="parentAddressAtBirthTimeSubdistrictId"
                      label="Birth Time Address Sub-district"
                      className="form-control"
                      options={(parentBirthTimeTehsilData && parentBirthTimeTehsilData) || []}
                      onChange={(e) => {
                        setParentBirthTimeTehsil(e.target.value);
                        setValue("parentAddressAtBirthTimeTownVillageId", "");
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Town/Village</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      name="parentAddressAtBirthTimeTownVillageId"
                      label="Birth Time Address Town/Village"
                      className="form-control"
                      options={(parentBirthTimeCityData && parentBirthTimeCityData) || []}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Pincode</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="parentAddressAtBirthTimePincode"
                      label="Birth Time Address Pincode"
                      type="number"
                      maxlength={6}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Place of Birth Section */}
          <div className="border-bottom mb-3">
            <h4 className="mb-3">Place of Birth</h4>
            <div className="row">
              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Place of Birth *</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      name="placeOfBirthId"
                      label="Place of Birth"
                      className="form-control"
                      options={placeOfBirthOptions}
                    />
                  </div>
                </div>
              </div>

              {watch("placeOfBirthId") === "1" && (
                <div className="col-md-6">
                  <div className="row align-items-center mb-3">
                    <div className="col-md-4">
                      <label className="form-label mb-md-0">Hospital</label>
                    </div>
                    <div className="col-md-8">
                      <RHFSelect
                        name="hospitalId"
                        label="Hospital"
                        className="form-control"
                        options={(hospitalData && hospitalData) || []}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">House No</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="placeOfBirthHouseNo"
                      label="Place of Birth House No"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Locality</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="placeOfBirthLocality"
                      label="Place of Birth Locality"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Ward Number</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="placeOfBirthWardNumber"
                      label="Place of Birth Ward Number"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">State</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      name="placeOfBirthStateUtId"
                      label="Place of Birth State"
                      className="form-control"
                      options={(stateData && stateData) || []}
                      onChange={(e) => {
                        setPlaceOfBirthState(e.target.value);
                        setValue("placeOfBirthDistrictId", "");
                        setValue("placeOfBirthSubdistrictId", "");
                        setValue("placeOfBirthTownVillageId", "");
                        setPlaceOfBirthDistrict("");
                        setPlaceOfBirthTehsil("");
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">District</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      name="placeOfBirthDistrictId"
                      label="Place of Birth District"
                      className="form-control"
                      options={(placeOfBirthDistrictData && placeOfBirthDistrictData) || []}
                      onChange={(e) => {
                        setPlaceOfBirthDistrict(e.target.value);
                        setValue("placeOfBirthSubdistrictId", "");
                        setValue("placeOfBirthTownVillageId", "");
                        setPlaceOfBirthTehsil("");
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Sub-district</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      name="placeOfBirthSubdistrictId"
                      label="Place of Birth Sub-district"
                      className="form-control"
                      options={(placeOfBirthTehsilData && placeOfBirthTehsilData) || []}
                      onChange={(e) => {
                        setPlaceOfBirthTehsil(e.target.value);
                        setValue("placeOfBirthTownVillageId", "");
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Town/Village</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      name="placeOfBirthTownVillageId"
                      label="Place of Birth Town/Village"
                      className="form-control"
                      options={(placeOfBirthCityData && placeOfBirthCityData) || []}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Pincode</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="placeOfBirthPincode"
                      label="Place of Birth Pincode"
                      type="number"
                      maxlength={6}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informant Details Section */}
          <div className="border-bottom mb-3">
            <h4 className="mb-3">Informant Details</h4>
            <div className="row">
              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Informant's Name *</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="informantsName"
                      label="Informant's Name"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Informant's Aadhaar</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="informantsAadhaarNumber"
                      label="Informant's Aadhaar Number"
                      type="number"
                      maxlength={12}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Informant's Mobile *</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="informantsMobileNumber"
                      label="Informant's Mobile Number"
                      type="number"
                      maxlength={10}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Informant's Email</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="informantsEmailId"
                      label="Informant's Email ID"
                      type="email"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">House No</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="informantsHouseNo"
                      label="Informant's House No"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Locality</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="informantsLocality"
                      label="Informant's Locality"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Ward Number</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="informantsWardNumber"
                      label="Informant's Ward Number"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">State</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      className="form-control"
                      label="Informant's State"
                      name="informantsStateUtId"
                      options={(stateData && stateData) || []}
                      onChange={(e) => {
                        setInformantState(e.target.value);
                        setValue("informantsDistrictId", "");
                        setValue("informantsSubdistrictId", "");
                        setValue("informantsTownVillageId", "");
                        setInformantDistrict("");
                        setInformantTehsil("");
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">District</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      name="informantsDistrictId"
                      label="Informant's District"
                      className="form-control"
                      options={(informantDistrictData && informantDistrictData) || []}
                      onChange={(e) => {
                        setInformantDistrict(e.target.value);
                        setValue("informantsSubdistrictId", "");
                        setValue("informantsTownVillageId", "");
                        setInformantTehsil("");
                      }}
                    />
                  </div>
                </div>
              </div>

             <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Sub-district</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      className="form-control"
                      name="informantsSubdistrictId"
                      label="Informant's Sub-district"
                      options={(informantTehsilData && informantTehsilData) || []}
                      onChange={(e) => {
                        setInformantTehsil(e.target.value);
                        setValue("informantsTownVillageId", "");
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Town/Village</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      name="informantsTownVillageId"
                      label="Informant's Town/Village"
                      className="form-control"
                      options={(informantCityData && informantCityData) || []}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Pincode</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="informantsPincode"
                      label="Informant's Pincode"
                      type="number"
                      maxlength={6}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Relation to Child</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      name="relationToChildId"
                      label="Relation to Child"
                      className="form-control"
                      options={(religionData && religionData) || []}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Birth Details Section */}
         <div className="border-bottom mb-3">
            <h4 className="mb-3">Birth Details</h4>
            <div className="row">
              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Type of Attention</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      name="typeOfAttentionId"
                      label="Type of Attention"
                      className="form-control"
                      options={(typeOfAttentionOptions && typeOfAttentionOptions) || []}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Method of Delivery</label>
                  </div>
                  <div className="col-md-8">
                    <RHFSelect
                      name="methodOfDeliveryId"
                      label="Method of Delivery"
                      className="form-control"
                      options={(methodOfDeliveryOptions && methodOfDeliveryOptions) || []}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Child Birth Weight (kg)</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="childBirthWeight"
                      label="Child Birth Weight"
                      type="number"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Duration of Pregnancy (weeks)</label>
                  </div>
                  <div className="col-md-8">
                    <RHFTextField
                      className="form-control"
                      name="durationOfPregnancy"
                      label="Duration of Pregnancy"
                      type="number"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Document Upload Section */}
          <div className="border-bottom mb-3">
            <h4 className="mb-3">Document Upload</h4>
            <div className="row">
              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Father's Aadhaar Proof</label>
                  </div>
                  <div className="col-md-8">
                    <RHFFileUpload
                      name="fatherAadhaarProof"
                      label="Father's Aadhaar Proof"
                      allowedTypes={[
                        "image/jpeg",
                        "image/png",
                        "application/pdf",
                      ]}
                      maxSizeInMB={1}
                      accept=".jpg,.jpeg,.png,.pdf"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Mother's Aadhaar Proof</label>
                  </div>
                  <div className="col-md-8">
                    <RHFFileUpload
                      name="motherAadhaarProof"
                      label="Mother's Aadhaar Proof"
                      allowedTypes={[
                        "image/jpeg",
                        "image/png",
                        "application/pdf",
                      ]}
                      maxSizeInMB={1}
                      accept=".jpg,.jpeg,.png,.pdf"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Child's Aadhaar Proof</label>
                  </div>
                  <div className="col-md-8">
                    <RHFFileUpload
                      name="childAadhaarProof"
                      label="Child's Aadhaar Proof"
                      allowedTypes={[
                        "image/jpeg",
                        "image/png",
                        "application/pdf",
                      ]}
                      maxSizeInMB={1}
                      accept=".jpg,.jpeg,.png,.pdf"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Hospital Discharge Certificate</label>
                  </div>
                  <div className="col-md-8">
                    <RHFFileUpload
                      name="hospitalDischargeCertificate"
                      label="Hospital Discharge Certificate"
                      allowedTypes={[
                        "image/jpeg",
                        "image/png",
                        "application/pdf",
                      ]}
                      maxSizeInMB={1}
                      accept=".jpg,.jpeg,.png,.pdf"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Witness Proof 1</label>
                  </div>
                  <div className="col-md-8">
                    <RHFFileUpload
                      name="witnessProof1"
                      label="witnessProof1"
                      allowedTypes={[
                        "image/jpeg",
                        "image/png",
                        "application/pdf",
                      ]}
                      maxSizeInMB={1}
                      accept=".jpg,.jpeg,.png,.pdf"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Witness Proof 2</label>
                  </div>
                  <div className="col-md-8">
                    <RHFFileUpload
                      name="witnessProof2"
                      label="Witness Proof 2"
                      allowedTypes={[
                        "image/jpeg",
                        "image/png",
                        "application/pdf",
                      ]}
                      maxSizeInMB={1}
                      accept=".jpg,.jpeg,.png,.pdf"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Marriage Certificate</label>
                  </div>
                  <div className="col-md-8">
                    <RHFFileUpload
                      name="marriageCertificate"
                      label="Marriage Certificate"
                      allowedTypes={[
                        "image/jpeg",
                        "image/png",
                        "application/pdf",
                      ]}
                      maxSizeInMB={1}
                      accept=".jpg,.jpeg,.png,.pdf"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label className="form-label mb-md-0">Address Proof</label>
                  </div>
                  <div className="col-md-8">
                    <RHFFileUpload
                      name="addressProof"
                      label="Address Proof"
                      allowedTypes={[
                        "image/jpeg",
                        "image/png",
                        "application/pdf",
                      ]}
                      maxSizeInMB={1}
                      accept=".jpg,.jpeg,.png,.pdf"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Declaration Section */}
          <div className="border-bottom mb-3">
            <h4 className="mb-3">Declaration</h4>
            <div className="row">
              <div className="col-md-12">
                <RHFCheckbox
                  name="declaration"
                  label="I hereby declare that the information provided above is true and correct to the best of my knowledge and belief. I understand that any false information may lead to rejection of the application or cancellation of the certificate issued."
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="row">
            <div className="col-md-12 text-center">
              <button
                type="button"
                className="btn btn-secondary me-3"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmSubmit}
                disabled={isSubmitting || isSubmitDisabled}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        
      </FormProvider>
    </div>
    </>
  );
};

export default BirthRegistrationFormComponent;