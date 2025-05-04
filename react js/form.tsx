import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormProvider from '../../hook-form/FormProvider';
import RHFTextField from '../../hook-form/RHFTextField';
import RHFCheckbox from '../../hook-form/RHFCheckbox';
import RHFDatePicker from '../../hook-form/RHFDatePicker';
import RHFSelect from '../../hook-form/RHFSelect';
import RHFFileUpload from '../../hook-form/RHFFileUpload';

// Define the interface for form values based on DeathAllDetailsDTO
interface DeathRegistrationFormValues {
  // Fields from DeathDetails
  id: string;
  registrationNo: string;
  hospitalId: string; // Dropdown
  dateOfReport: string;
  dateOfDeath: string;
  firstName: string;
  middleName: string;
  lastName: string;
  placeOfDeath: string;
  informantsName: string;
  informantsAddress: string;
  counter: string;
  tenantId: string;
  gender: 'male' | 'female' | 'other';
  remarks: string;
  eidNo: string;
  aadharNo: string;
  nationalityId: string; // Dropdown
  religionId: string; // Dropdown
  icdCode: string;
  age: string;
  isLegacyRecord: boolean;

  // Fields from DeathMotherInfo
  motherFirstName: string;
  motherMiddleName: string;
  motherLastName: string;
  motherAadharNo: string;
  motherEmailId: string;
  motherMobileNo: string;

  // Fields from DeathSpouseInfo
  spouseFirstName: string;
  spouseMiddleName: string;
  spouseLastName: string;
  spouseAadharNo: string;
  spouseEmailId: string;
  spouseMobileNo: string;

  // Fields from DeathPermanentAddress
  permBuildingNo: string;
  permHouseNo: string;
  permStreetName: string;
  permLocality: string;
  permTehsil: string;
  permDistrict: string;
  permCity: string;
  permState: string;
  permPinNo: string;
  permCountry: string;

  // Fields from DeathPresentAddress
  presBuildingNo: string;
  presHouseNo: string;
  presStreetName: string;
  presLocality: string;
  presTehsil: string;
  presDistrict: string;
  presCity: string;
  presState: string;
  presPinNo: string;
  presCountry: string;

  // Additional field for address checkbox
  sameAsPermanent: boolean;
  
  // File upload for supporting documents
  supportingDocuments: File | null;
  
  // Agreement field
  agree: boolean;
}

// Default values for the form
const defaultValues: DeathRegistrationFormValues = {
  // Fields from DeathDetails
  id: '',
  registrationNo: '',
  hospitalId: '',
  dateOfReport: '',
  dateOfDeath: '',
  firstName: '',
  middleName: '',
  lastName: '',
  placeOfDeath: '',
  informantsName: '',
  informantsAddress: '',
  counter: '',
  tenantId: '',
  gender: 'male',
  remarks: '',
  eidNo: '',
  aadharNo: '',
  nationalityId: '',
  religionId: '',
  icdCode: '',
  age: '',
  isLegacyRecord: false,

  // Fields from DeathMotherInfo
  motherFirstName: '',
  motherMiddleName: '',
  motherLastName: '',
  motherAadharNo: '',
  motherEmailId: '',
  motherMobileNo: '',

  // Fields from DeathSpouseInfo
  spouseFirstName: '',
  spouseMiddleName: '',
  spouseLastName: '',
  spouseAadharNo: '',
  spouseEmailId: '',
  spouseMobileNo: '',

  // Fields from DeathPermanentAddress
  permBuildingNo: '',
  permHouseNo: '',
  permStreetName: '',
  permLocality: '',
  permTehsil: '',
  permDistrict: '',
  permCity: '',
  permState: '',
  permPinNo: '',
  permCountry: '',

  // Fields from DeathPresentAddress
  presBuildingNo: '',
  presHouseNo: '',
  presStreetName: '',
  presLocality: '',
  presTehsil: '',
  presDistrict: '',
  presCity: '',
  presState: '',
  presPinNo: '',
  presCountry: '',

  // Additional fields
  sameAsPermanent: false,
  supportingDocuments: null,
  agree: false,
};

// Mock data for dropdowns
const hospitals = [
  { value: '1', label: 'City General Hospital' },
  { value: '2', label: 'District Medical Center' },
  { value: '3', label: 'Community Health Hospital' },
  { value: '4', label: 'Private Medical Center' },
];

const nationalities = [
  { value: '1', label: 'Indian' },
  { value: '2', label: 'American' },
  { value: '3', label: 'British' },
  { value: '4', label: 'Canadian' },
  { value: '5', label: 'Australian' },
];

const religions = [
  { value: '1', label: 'Hinduism' },
  { value: '2', label: 'Islam' },
  { value: '3', label: 'Christianity' },
  { value: '4', label: 'Sikhism' },
  { value: '5', label: 'Buddhism' },
  { value: '6', label: 'Jainism' },
  { value: '7', label: 'Other' },
];

// Validation schema
const validationSchema = yup.object().shape({
  // Registration Details
  registrationNo: yup.string().required('Registration number is required'),
  hospitalId: yup.string().required('Hospital is required'),
  dateOfReport: yup.string().required('Date of report is required'),
  dateOfDeath: yup.string().required('Date of death is required'),
  
  // Personal Information
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  gender: yup.string().oneOf(['male', 'female', 'other']).required('Gender is required'),
  age: yup.string()
    .matches(/^\d+$/, 'Age must be a valid number')
    .required('Age is required'),
  placeOfDeath: yup.string().required('Place of death is required'),
  
  // Other Required Details
  nationalityId: yup.string().required('Nationality is required'),
  religionId: yup.string().required('Religion is required'),
  
  // Identification
  aadharNo: yup.string()
    .matches(/^\d{12}$/, 'Aadhar number must be 12 digits')
    .nullable(),
  
  // Permanent Address (Required fields)
  permStreetName: yup.string().required('Street name is required'),
  permCity: yup.string().required('City is required'),
  permState: yup.string().required('State is required'),
  permCountry: yup.string().required('Country is required'),
  permPinNo: yup.string()
    .matches(/^\d{6}$/, 'PIN code must be 6 digits')
    .required('PIN code is required'),
  
  // Present Address (Conditional validation)
  presStreetName: yup.string().when('sameAsPermanent', {
    is: false,
    then: (schema) => schema.required('Street name is required'),
    otherwise: (schema) => schema,
  }),
  presCity: yup.string().when('sameAsPermanent', {
    is: false,
    then: (schema) => schema.required('City is required'),
    otherwise: (schema) => schema,
  }),
  presState: yup.string().when('sameAsPermanent', {
    is: false,
    then: (schema) => schema.required('State is required'),
    otherwise: (schema) => schema,
  }),
  presCountry: yup.string().when('sameAsPermanent', {
    is: false,
    then: (schema) => schema.required('Country is required'),
    otherwise: (schema) => schema,
  }),
  presPinNo: yup.string().when('sameAsPermanent', {
    is: false,
    then: (schema) => schema.matches(/^\d{6}$/, 'PIN code must be 6 digits').required('PIN code is required'),
    otherwise: (schema) => schema,
  }),
  
  // Mother's Information
  motherFirstName: yup.string(),
  motherMobileNo: yup.string()
    .matches(/^\d{10}$/, 'Mobile number must be 10 digits')
    .nullable(),
  motherEmailId: yup.string().email('Invalid email format').nullable(),
  
  // Spouse Information
  spouseFirstName: yup.string(),
  spouseMobileNo: yup.string()
    .matches(/^\d{10}$/, 'Mobile number must be 10 digits')
    .nullable(),
  spouseEmailId: yup.string().email('Invalid email format').nullable(),
  
  // Informant's Information
  informantsName: yup.string().required('Informant\'s name is required'),
  informantsAddress: yup.string().required('Informant\'s address is required'),
  
  // Agreement
  agree: yup.boolean()
    .oneOf([true], 'You must agree to the declaration')
    .required('You must agree to the declaration'),
  
  // Documents
  supportingDocuments: yup.mixed<File>()
    .test('required', 'Supporting documents are required', (value) => !!value),
});

const DeathRegistrationForm = () => {
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const methods = useForm<DeathRegistrationFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });
  
  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue,
  } = methods;
  
  // Watch the sameAsPermanent checkbox value
  const sameAsPermanent = watch('sameAsPermanent');
  
  // Handle same address checkbox change
  const handleSameAddressChange = (checked: boolean) => {
    if (checked) {
      // Copy address fields from permanent address to present address
      setValue('presBuildingNo', watch('permBuildingNo'));
      setValue('presHouseNo', watch('permHouseNo'));
      setValue('presStreetName', watch('permStreetName'));
      setValue('presLocality', watch('permLocality'));
      setValue('presTehsil', watch('permTehsil'));
      setValue('presDistrict', watch('permDistrict'));
      setValue('presCity', watch('permCity'));
      setValue('presState', watch('permState'));
      setValue('presPinNo', watch('permPinNo'));
      setValue('presCountry', watch('permCountry'));
    }
  };
  
  const onSubmit = (data: DeathRegistrationFormValues) => {
    setIsSubmitDisabled(true);
    console.log('Form data submitted:', data);
    
    // Simulate API call
    setTimeout(() => {
      setShowSuccess(true);
      setIsSubmitDisabled(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1000);
  };
  
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {/* Registration Details Section */}
      <div className="section">
        <h2>Registration Details</h2>
        <div className="row">
          <div className="col">
            <RHFTextField name="registrationNo" label="Registration Number *" />
          </div>
          <div className="col">
            <RHFSelect
              name="hospitalId"
              label="Hospital *"
              options={hospitals}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <RHFDatePicker name="dateOfReport" label="Date of Report *" />
          </div>
          <div className="col">
            <RHFDatePicker name="dateOfDeath" label="Date of Death *" />
          </div>
        </div>
      </div>
      
      {/* Personal Information Section */}
      <div className="section">
        <h2>Personal Information</h2>
        <div className="row">
          <div className="col">
            <RHFTextField name="firstName" label="First Name *" />
          </div>
          <div className="col">
            <RHFTextField name="middleName" label="Middle Name" />
          </div>
          <div className="col">
            <RHFTextField name="lastName" label="Last Name *" />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <RHFSelect
              name="gender"
              label="Gender *"
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
              ]}
            />
          </div>
          <div className="col">
            <RHFTextField name="age" label="Age *" />
          </div>
          <div className="col">
            <RHFTextField name="placeOfDeath" label="Place of Death *" />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <RHFTextField name="aadharNo" label="Aadhar Number" />
          </div>
          <div className="col">
            <RHFTextField name="eidNo" label="EID Number" />
          </div>
          <div className="col">
            <RHFTextField name="icdCode" label="ICD Code" />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <RHFSelect
              name="nationalityId"
              label="Nationality *"
              options={nationalities}
            />
          </div>
          <div className="col">
            <RHFSelect
              name="religionId"
              label="Religion *"
              options={religions}
            />
          </div>
          <div className="col">
            <RHFTextField name="tenantId" label="Tenant ID" />
          </div>
        </div>
      </div>
      
      {/* Mother's Information Section */}
      <div className="section">
        <h2>Mother's Information</h2>
        <div className="row">
          <div className="col">
            <RHFTextField name="motherFirstName" label="First Name" />
          </div>
          <div className="col">
            <RHFTextField name="motherMiddleName" label="Middle Name" />
          </div>
          <div className="col">
            <RHFTextField name="motherLastName" label="Last Name" />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <RHFTextField name="motherAadharNo" label="Aadhar Number" />
          </div>
          <div className="col">
            <RHFTextField name="motherEmailId" label="Email ID" type="email" />
          </div>
          <div className="col">
            <RHFTextField name="motherMobileNo" label="Mobile Number" />
          </div>
        </div>
      </div>
      
      {/* Spouse Information Section */}
      <div className="section">
        <h2>Spouse Information</h2>
        <div className="row">
          <div className="col">
            <RHFTextField name="spouseFirstName" label="First Name" />
          </div>
          <div className="col">
            <RHFTextField name="spouseMiddleName" label="Middle Name" />
          </div>
          <div className="col">
            <RHFTextField name="spouseLastName" label="Last Name" />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <RHFTextField name="spouseAadharNo" label="Aadhar Number" />
          </div>
          <div className="col">
            <RHFTextField name="spouseEmailId" label="Email ID" type="email" />
          </div>
          <div className="col">
            <RHFTextField name="spouseMobileNo" label="Mobile Number" />
          </div>
        </div>
      </div>
      
      {/* Permanent Address Section */}
      <div className="section">
        <h2>Permanent Address</h2>
        <div className="row">
          <div className="col">
            <RHFTextField name="permBuildingNo" label="Building Number" />
          </div>
          <div className="col">
            <RHFTextField name="permHouseNo" label="House Number" />
          </div>
          <div className="col">
            <RHFTextField name="permStreetName" label="Street Name *" />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <RHFTextField name="permLocality" label="Locality" />
          </div>
          <div className="col">
            <RHFTextField name="permTehsil" label="Tehsil" />
          </div>
          <div className="col">
            <RHFTextField name="permDistrict" label="District" />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <RHFTextField name="permCity" label="City *" />
          </div>
          <div className="col">
            <RHFTextField name="permState" label="State *" />
          </div>
          <div className="col">
            <RHFTextField name="permPinNo" label="PIN Code *" />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <RHFTextField name="permCountry" label="Country *" />
          </div>
        </div>
      </div>
      
      {/* Present Address Section */}
      <div className="section">
        <div className="row">
          <div className="col">
            <RHFCheckbox 
              name="sameAsPermanent" 
              label="Present Address same as Permanent Address"
              onChange={(e) => handleSameAddressChange(e.target.checked)}
            />
          </div>
        </div>
        
        <h2>Present Address</h2>
        <div className="row">
          <div className="col">
            <RHFTextField 
              name="presBuildingNo" 
              label="Building Number" 
              disabled={sameAsPermanent}
            />
          </div>
          <div className="col">
            <RHFTextField 
              name="presHouseNo" 
              label="House Number" 
              disabled={sameAsPermanent}
            />
          </div>
          <div className="col">
            <RHFTextField 
              name="presStreetName" 
              label="Street Name *" 
              disabled={sameAsPermanent}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <RHFTextField 
              name="presLocality" 
              label="Locality" 
              disabled={sameAsPermanent}
            />
          </div>
          <div className="col">
            <RHFTextField 
              name="presTehsil" 
              label="Tehsil" 
              disabled={sameAsPermanent}
            />
          </div>
          <div className="col">
            <RHFTextField 
              name="presDistrict" 
              label="District" 
              disabled={sameAsPermanent}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <RHFTextField 
              name="presCity" 
              label="City *" 
              disabled={sameAsPermanent}
            />
          </div>
          <div className="col">
            <RHFTextField 
              name="presState" 
              label="State *" 
              disabled={sameAsPermanent}
            />
          </div>
          <div className="col">
            <RHFTextField 
              name="presPinNo" 
              label="PIN Code *" 
              disabled={sameAsPermanent}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <RHFTextField 
              name="presCountry" 
              label="Country *" 
              disabled={sameAsPermanent}
            />
          </div>
        </div>
      </div>
      
      {/* Informant's Information */}
      <div className="section">
        <h2>Informant's Information</h2>
        <div className="row">
          <div className="col">
            <RHFTextField name="informantsName" label="Informant's Name *" />
          </div>
          <div className="col">
            <RHFTextField name="informantsAddress" label="Informant's Address *" />
          </div>
        </div>
      </div>
      
      {/* Additional Details */}
      <div className="section">
        <h2>Additional Details</h2>
        <div className="row">
          <div className="col">
            <RHFTextField name="remarks" label="Remarks" multiline rows={3} />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <RHFCheckbox name="isLegacyRecord" label="Is Legacy Record" />
          </div>
        </div>
      </div>
      
      {/* Supporting Documents */}
      <div className="section">
        <h2>Supporting Documents</h2>
        <div className="row">
          <div className="col">
            <RHFFileUpload name="supportingDocuments" label="Upload Documents *" />
          </div>
        </div>
      </div>
      
      {/* Declaration */}
      <div className="section terms">
        <div className="row">
          <div className="col">
            <RHFCheckbox name="agree" label="I hereby declare that all the information provided is true and correct to the best of my knowledge." />
          </div>
        </div>
      </div>
      
      {/* Success Message */}
      {showSuccess && (
        <div className="success-message">
          <p>Success! Death registration form submitted successfully.</p>
        </div>
      )}
      
      {/* Form Buttons */}
      <div className="form-buttons">
        <button type="button" className="reset-btn">
          RESET
        </button>
        <button
          type="submit"
          className="submit-btn"
          disabled={isSubmitDisabled || isSubmitting}
        >
          {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
        </button>
      </div>
    </FormProvider>
  );
};

export default DeathRegistrationForm;






















----------------

const dateRangeSchema = yup.object({
  startDate: yup.date()
    .required('Start date is required')
    .typeError('Please enter a valid start date'),
  endDate: yup.date()
    .required('End date is required')
    .min(
      yup.ref('startDate'), 
      'End date must be after the start date'
    )
    .typeError('Please enter a valid end date')
});
----------------------

<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>


npm install @tabler/icons-react
import { IconEdit } from '@tabler/icons-react';
<IconEdit stroke={2} />


-------------------

<IconTrash stroke={2} />
import { IconTrash } from '@tabler/icons-react';

<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>