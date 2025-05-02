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

// Define form value interface
interface BirthRegistrationFormValues {
  // Registration Details
  registrationNumber: string;
  registrationDate: string;
  hospitalName: string;
  
  // Information at Birth
  childName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  placeOfBirth: string;
  weight: string;
  
  // Birth Place
  birthPlace: string;
  birthPlaceType: 'hospital' | 'home' | 'other';
  
  // Father's Information
  fatherName: string;
  fatherAadhar: string;
  fatherEducation: string;
  fatherProfession: string;
  fatherReligion: string;
  
  // Mother's Information
  motherName: string;
  motherAadhar: string;
  motherEducation: string;
  motherProfession: string;
  motherReligion: string;
  
  // Address at Time of Birth
  birthAddressBuildingNumber: string;
  birthAddressHouseNo: string;
  birthAddressStreet: string;
  birthAddressLocality: string;
  birthAddressTehsil: string;
  birthAddressDistrict: string;
  birthAddressCity: string;
  birthAddressState: string;
  birthAddressPincode: string;
  birthAddressCountry: string;
  
  // Permanent Address Fields
  sameAsTimeOfBirth: boolean;
  permAddressBuildingNumber: string;
  permAddressHouseNo: string;
  permAddressStreet: string;
  permAddressLocality: string;
  permAddressTehsil: string;
  permAddressDistrict: string;
  permAddressCity: string;
  permAddressState: string;
  permAddressPincode: string;
  permAddressCountry: string;
  
  // Informant's Information
  informantName: string;
  informantAddress: string;
  informantRemarks: string;
  
  // Additional Details
  email: string;
  mobileNumber: string;
  nationality: string;
  attachedDocuments: File | null;
  agree: boolean;
}

// Default values for the form
const defaultValues: BirthRegistrationFormValues = {
  // Registration Details
  registrationNumber: '',
  registrationDate: '',
  hospitalName: '',
  
  // Information at Birth
  childName: '',
  dateOfBirth: '',
  gender: 'male',
  placeOfBirth: '',
  weight: '',
  
  // Birth Place
  birthPlace: '',
  birthPlaceType: 'hospital',
  
  // Father's Information
  fatherName: '',
  fatherAadhar: '',
  fatherEducation: '',
  fatherProfession: '',
  fatherReligion: '',
  
  // Mother's Information
  motherName: '',
  motherAadhar: '',
  motherEducation: '',
  motherProfession: '',
  motherReligion: '',
  
  // Address at Time of Birth
  birthAddressBuildingNumber: '',
  birthAddressHouseNo: '',
  birthAddressStreet: '',
  birthAddressLocality: '',
  birthAddressTehsil: '',
  birthAddressDistrict: '',
  birthAddressCity: '',
  birthAddressState: '',
  birthAddressPincode: '',
  birthAddressCountry: '',
  
  // Permanent Address Fields
  sameAsTimeOfBirth: false,
  permAddressBuildingNumber: '',
  permAddressHouseNo: '',
  permAddressStreet: '',
  permAddressLocality: '',
  permAddressTehsil: '',
  permAddressDistrict: '',
  permAddressCity: '',
  permAddressState: '',
  permAddressPincode: '',
  permAddressCountry: '',
  
  // Informant's Information
  informantName: '',
  informantAddress: '',
  informantRemarks: '',
  
  // Additional Details
  email: '',
  mobileNumber: '',
  nationality: 'Indian',
  attachedDocuments: null,
  agree: false,
};

// Validation schema
const validationSchema = yup.object().shape({
  // Registration Details
  registrationNumber: yup.string().required('Registration number is required'),
  registrationDate: yup.string().required('Registration date is required'),
  
  // Information at Birth
  childName: yup.string().required('Child name is required'),
  dateOfBirth: yup.string().required('Date of birth is required'),
  gender: yup.string().oneOf(['male', 'female', 'other']).required('Gender is required'),
  
  // Address at Time of Birth (Required fields)
  birthAddressStreet: yup.string().required('Street name is required'),
  birthAddressCity: yup.string().required('City is required'),
  birthAddressState: yup.string().required('State is required'),
  birthAddressCountry: yup.string().required('Country is required'),
  
  // Permanent Address Fields (Conditional validation)
  permAddressStreet: yup.string().when('sameAsTimeOfBirth', {
    is: false,
    then: (schema) => schema.required('Street name is required'),
    otherwise: (schema) => schema,
  }),
  permAddressCity: yup.string().when('sameAsTimeOfBirth', {
    is: false,
    then: (schema) => schema.required('City is required'),
    otherwise: (schema) => schema,
  }),
  permAddressState: yup.string().when('sameAsTimeOfBirth', {
    is: false,
    then: (schema) => schema.required('State is required'),
    otherwise: (schema) => schema,
  }),
  permAddressCountry: yup.string().when('sameAsTimeOfBirth', {
    is: false,
    then: (schema) => schema.required('Country is required'),
    otherwise: (schema) => schema,
  }),
  
  // Parents Information
  fatherName: yup.string().required('Father\'s name is required'),
  motherName: yup.string().required('Mother\'s name is required'),
  
  // Additional Details
  email: yup.string().email('Invalid email format').required('Email is required'),
  mobileNumber: yup.string().required('Mobile number is required'),
  agree: yup.boolean().oneOf([true], 'You must agree to the terms and conditions'),
});

const BirthRegistrationForm = () => {
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const methods = useForm<BirthRegistrationFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });
  
  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue,
  } = methods;
  
  // Watch the sameAsTimeOfBirth checkbox value
  const sameAsTimeOfBirth = watch('sameAsTimeOfBirth');
  
  // Handle sameAsTimeOfBirth checkbox change
  const handleSameAddressChange = (checked: boolean) => {
    if (checked) {
      // Copy address fields from birth address to permanent address
      setValue('permAddressBuildingNumber', watch('birthAddressBuildingNumber'));
      setValue('permAddressHouseNo', watch('birthAddressHouseNo'));
      setValue('permAddressStreet', watch('birthAddressStreet'));
      setValue('permAddressLocality', watch('birthAddressLocality'));
      setValue('permAddressTehsil', watch('birthAddressTehsil'));
      setValue('permAddressDistrict', watch('birthAddressDistrict'));
      setValue('permAddressCity', watch('birthAddressCity'));
      setValue('permAddressState', watch('birthAddressState'));
      setValue('permAddressPincode', watch('birthAddressPincode'));
      setValue('permAddressCountry', watch('birthAddressCountry'));
    }
  };
  
  const onSubmit = (data: BirthRegistrationFormValues) => {
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
            <RHFTextField name="registrationNumber" label="Registration Number *" />
          </div>
          <div className="col">
            <RHFDatePicker name="registrationDate" label="Registration Date *" />
          </div>
          <div className="col">
            <RHFTextField name="hospitalName" label="Hospital Name" />
          </div>
        </div>
      </div>
      
      {/* Information at Birth Section */}
      <div className="section">
        <h2>Information at Birth</h2>
        <div className="row">
          <div className="col">
            <RHFTextField name="childName" label="Child Name *" />
          </div>
          <div className="col">
            <RHFDatePicker name="dateOfBirth" label="Date of Birth *" />
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
            <RHFTextField name="weight" label="Weight (kg)" />
          </div>
          <div className="col">
            <RHFTextField name="placeOfBirth" label="Place of Birth" />
          </div>
        </div>
      </div>
      
      {/* Father's Information Section */}
      <div className="section">
        <h2>Father's Information</h2>
        <div className="row">
          <div className="col">
            <RHFTextField name="fatherName" label="Father's Name *" />
          </div>
          <div className="col">
            <RHFTextField name="fatherAadhar" label="Aadhar Number" />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <RHFTextField name="fatherEducation" label="Education" />
          </div>
          <div className="col">
            <RHFTextField name="fatherProfession" label="Profession" />
          </div>
          <div className="col">
            <RHFTextField name="fatherReligion" label="Religion" />
          </div>
        </div>
      </div>
      
      {/* Mother's Information Section */}
      <div className="section">
        <h2>Mother's Information</h2>
        <div className="row">
          <div className="col">
            <RHFTextField name="motherName" label="Mother's Name *" />
          </div>
          <div className="col">
            <RHFTextField name="motherAadhar" label="Aadhar Number" />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <RHFTextField name="motherEducation" label="Education" />
          </div>
          <div className="col">
            <RHFTextField name="motherProfession" label="Profession" />
          </div>
          <div className="col">
            <RHFTextField name="motherReligion" label="Religion" />
          </div>
        </div>
      </div>
      
      {/* Address at Time of Birth Section */}
      <div className="section">
        <h2>Address of Parents at the Time of Birth</h2>
        <div className="row">
          <div className="col">
            <RHFTextField name="birthAddressBuildingNumber" label="Building Number" />
          </div>
          <div className="col">
            <RHFTextField name="birthAddressHouseNo" label="House No" />
          </div>
          <div className="col">
            <RHFTextField name="birthAddressStreet" label="Street Name *" />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <RHFTextField name="birthAddressLocality" label="Locality" />
          </div>
          <div className="col">
            <RHFTextField name="birthAddressTehsil" label="Tehsil" />
          </div>
          <div className="col">
            <RHFTextField name="birthAddressDistrict" label="District" />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <RHFTextField name="birthAddressCity" label="City *" />
          </div>
          <div className="col">
            <RHFTextField name="birthAddressState" label="State *" />
          </div>
          <div className="col">
            <RHFTextField name="birthAddressPincode" label="Pincode" />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <RHFTextField name="birthAddressCountry" label="Country *" />
          </div>
        </div>
      </div>
      
      {/* Permanent Address Section */}
      <div className="section">
        <div className="row">
          <div className="col">
            <RHFCheckbox 
              name="sameAsTimeOfBirth" 
              label="If Permanent Address of Parents is same as Address of Parents at the time of Birth"
              onChange={(e) => handleSameAddressChange(e.target.checked)}
            />
          </div>
        </div>
        
        <h2>Permanent Address of Parents</h2>
        <div className="row">
          <div className="col">
            <RHFTextField 
              name="permAddressBuildingNumber" 
              label="Building Number *" 
              disabled={sameAsTimeOfBirth}
            />
          </div>
          <div className="col">
            <RHFTextField 
              name="permAddressHouseNo" 
              label="House No *" 
              disabled={sameAsTimeOfBirth}
            />
          </div>
          <div className="col">
            <RHFTextField 
              name="permAddressStreet" 
              label="Street Name *" 
              disabled={sameAsTimeOfBirth}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <RHFTextField 
              name="permAddressLocality" 
              label="Locality *" 
              disabled={sameAsTimeOfBirth}
            />
          </div>
          <div className="col">
            <RHFTextField 
              name="permAddressTehsil" 
              label="Tehsil *" 
              disabled={sameAsTimeOfBirth}
            />
          </div>
          <div className="col">
            <RHFTextField 
              name="permAddressDistrict" 
              label="District *" 
              disabled={sameAsTimeOfBirth}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <RHFTextField 
              name="permAddressCity" 
              label="City *" 
              disabled={sameAsTimeOfBirth}
            />
          </div>
          <div className="col">
            <RHFTextField 
              name="permAddressState" 
              label="State *" 
              disabled={sameAsTimeOfBirth}
            />
          </div>
          <div className="col">
            <RHFTextField 
              name="permAddressPincode" 
              label="Pincode *" 
              disabled={sameAsTimeOfBirth}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <RHFTextField 
              name="permAddressCountry" 
              label="Country *" 
              disabled={sameAsTimeOfBirth}
            />
          </div>
        </div>
      </div>
      
      {/* Contact Information */}
      <div className="section">
        <h2>Contact Information</h2>
        <div className="row">
          <div className="col">
            <RHFTextField name="email" label="Email ID *" type="email" />
          </div>
          <div className="col">
            <RHFTextField name="mobileNumber" label="Mobile Number *" />
          </div>
          <div className="col">
            <RHFTextField name="nationality" label="Nationality *" />
          </div>
        </div>
      </div>
      
      {/* Informant's Information */}
      <div className="section">
        <h2>Informant's Information</h2>
        <div className="row">
          <div className="col">
            <RHFTextField name="informantName" label="Name" />
          </div>
          <div className="col">
            <RHFTextField name="informantAddress" label="Address" />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <RHFTextField name="informantRemarks" label="Remarks" multiline rows={3} />
          </div>
        </div>
      </div>
      
      {/* Supporting Documents */}
      <div className="section">
        <h2>Supporting Documents</h2>
        <div className="row">
          <div className="col">
            <RHFFileUpload name="attachedDocuments" label="Upload Documents *" />
          </div>
        </div>
      </div>
      
      {/* Terms & Conditions */}
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
          <p>Success! Birth registration form submitted successfully.</p>
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

export default BirthRegistrationForm;








-------------------------------------------------------------



import * as yup from 'yup';
import { BirthRegistrationFormValues } from './interfaces';

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;
// Allowed file types
const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

export const validationSchema: yup.ObjectSchema<BirthRegistrationFormValues> = yup.object().shape({
  // Registration Details
  registrationNumber: yup.string().required('Registration number is required'),
  registrationDate: yup.string().required('Registration date is required'),
  hospitalName: yup.string(),
  
  // Information at Birth
  childName: yup.string().required('Child name is required'),
  dateOfBirth: yup.string().required('Date of birth is required'),
  gender: yup.string().oneOf(['male', 'female', 'other']).required('Gender is required'),
  placeOfBirth: yup.string(),
  weight: yup.string().matches(/^\d*\.?\d*$/, 'Weight must be a valid number'),
  
  // Birth Place
  birthPlace: yup.string(),
  birthPlaceType: yup.string().oneOf(['hospital', 'home', 'other']),
  
  // Father's Information
  fatherName: yup.string().required('Father\'s name is required'),
  fatherAadhar: yup.string()
    .matches(/^\d{12}$/, 'Aadhar number must be 12 digits')
    .nullable(),
  fatherEducation: yup.string(),
  fatherProfession: yup.string(),
  fatherReligion: yup.string(),
  
  // Mother's Information
  motherName: yup.string().required('Mother\'s name is required'),
  motherAadhar: yup.string()
    .matches(/^\d{12}$/, 'Aadhar number must be 12 digits')
    .nullable(),
  motherEducation: yup.string(),
  motherProfession: yup.string(),
  motherReligion: yup.string(),
  
  // Address at Time of Birth
  birthAddressBuildingNumber: yup.string(),
  birthAddressHouseNo: yup.string(),
  birthAddressStreet: yup.string().required('Street name is required'),
  birthAddressLocality: yup.string(),
  birthAddressTehsil: yup.string(),
  birthAddressDistrict: yup.string(),
  birthAddressCity: yup.string().required('City is required'),
  birthAddressState: yup.string().required('State is required'),
  birthAddressPincode: yup.string()
    .matches(/^\d{6}$/, 'Pincode must be 6 digits'),
  birthAddressCountry: yup.string().required('Country is required'),
  
  // Permanent Address Fields
  sameAsTimeOfBirth: yup.boolean(),
  permAddressBuildingNumber: yup.string().when('sameAsTimeOfBirth', {
    is: false,
    then: (schema) => schema,
    otherwise: (schema) => schema,
  }),
  permAddressHouseNo: yup.string().when('sameAsTimeOfBirth', {
    is: false,
    then: (schema) => schema,
    otherwise: (schema) => schema,
  }),
  permAddressStreet: yup.string().when('sameAsTimeOfBirth', {
    is: false,
    then: (schema) => schema.required('Street name is required'),
    otherwise: (schema) => schema,
  }),
  permAddressLocality: yup.string().when('sameAsTimeOfBirth', {
    is: false,
    then: (schema) => schema,
    otherwise: (schema) => schema,
  }),
  permAddressTehsil: yup.string().when('sameAsTimeOfBirth', {
    is: false,
    then: (schema) => schema,
    otherwise: (schema) => schema,
  }),
  permAddressDistrict: yup.string().when('sameAsTimeOfBirth', {
    is: false,
    then: (schema) => schema,
    otherwise: (schema) => schema,
  }),
  permAddressCity: yup.string().when('sameAsTimeOfBirth', {
    is: false,
    then: (schema) => schema.required('City is required'),
    otherwise: (schema) => schema,
  }),
  permAddressState: yup.string().when('sameAsTimeOfBirth', {
    is: false,
    then: (schema) => schema.required('State is required'),
    otherwise: (schema) => schema,
  }),
  permAddressPincode: yup.string().when('sameAsTimeOfBirth', {
    is: false,
    then: (schema) => schema.matches(/^\d{6}$/, 'Pincode must be 6 digits'),
    otherwise: (schema) => schema,
  }),
  permAddressCountry: yup.string().when('sameAsTimeOfBirth', {
    is: false,
    then: (schema) => schema.required('Country is required'),
    otherwise: (schema) => schema,
  }),
  
  // Informant's Information
  informantName: yup.string(),
  informantAddress: yup.string(),
  informantRemarks: yup.string(),
  
  // Additional Details
  email: yup.string().email('Invalid email format').required('Email is required'),
  mobileNumber: yup.string()
    .matches(/^\d{10}$/, 'Mobile number must be 10 digits')
    .required('Mobile number is required'),
  nationality: yup.string().required('Nationality is required'),
  
  // Documents
  attachedDocuments: yup.mixed<File>()
    .test('required', 'Document is required', (value) => !!value)
    .test('fileSize', 'File size is too large (max 5MB)', (value) => {
      if (!value) return true;
      return value.size <= MAX_FILE_SIZE;
    })
    .test('fileType', 'Unsupported file format', (value) => {
      if (!value) return true;
      return ALLOWED_FILE_TYPES.includes(value.type);
    }),
  
  // Terms
  agree: yup.boolean()
    .oneOf([true], 'You must agree to the declaration')
    .required('You must agree to the declaration'),
});