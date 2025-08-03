import React, { useState } from 'react';

const HealthLicenseForm = () => {
  // State management
  const [partners, setPartners] = useState([{ partnerName: '', partnerAadharNumber: '', partnerAddress: '' }]);
  const [floors, setFloors] = useState([{ floorId: '', coveredAreaOfFloor: '', unitAreaInSquareMtr: '' }]);
  
  const watch = (field) => field === "licenseTypeId" ? "2" : "";
  const setTradeDescription = (value) => console.log("Trade Description:", value);
  const postbirthCertificateDatafn2 = (data) => console.log("Download:", data);
  const moment = () => ({ subtract: (i) => ({ year: () => new Date().getFullYear() - i }) });
  
  const TradeLicenseTypeMasterdata = [];
  const TradeData = { existing_license_picture: "", license_keeper_picture: "", aadhar_picture: "" };
  const TradeAreaMasterdata = [];
  const TradePremisesStatusTypeData = [];
  const TradeConstitutionTtypedata = [];
  const TradePropertyTitledata = [];
  const TradeOwnershipMasterdata = [];
  const TradeFloorMasterdata = [];
  const TradeDiscriptionMasterdata = [];
  const UnderSection = "Section 123";

  const licenseTypeField = {
    number: "1",
    colClass: "col-md-6 mt-2 mb-2",
    labelColClass: "col-md-3",
    inputColClass: "col-md-8",
    label: "License Type",
    required: true,
    component: "RHFRadioGroup",
    name: "licenseTypeId",
    options: TradeLicenseTypeMasterdata || []
  };

  const renewalFields = [
    {
      letter: "a",
      colClass: "col-md-6 mt-2 mb-2",
      label: "Existing license number",
      required: true,
      component: "RHFTextField",
      name: "existingLicenseNumber",
      fieldType: "ward"
    },
    {
      letter: "b", 
      colClass: "col-md-6 mt-2 mb-2",
      label: "Existing license expiry date",
      required: true,
      component: "RHFDatePicker",
      name: "existingLicenseExpiryDate",
      maxDateToday: true
    },
    {
      letter: "c",
      colClass: "col-md-6 mt-2 mb-2", 
      label: "Existing licence keeper name",
      required: true,
      component: "RHFTextField",
      name: "existingLicenseKeeperName",
      fieldType: "name",
      allowTextField: true
    },
    {
      letter: "d",
      colClass: "col-md-6",
      label: "Picture of existing licence",
      component: "RHFFileUpload",
      name: "existingLicensePicture",
      allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
      maxSizeInMB: 1,
      accept: ".jpg,.jpeg,.png,.pdf",
      hasDownload: true,
      downloadData: TradeData?.existing_license_picture
    }
  ];

  const formSections = [
    {
      sectionNumber: "2",
      title: "APPLICANT DETAILS",
      subtitle: "(Fields marked * are mandatory)",
      fields: [
        {
          letter: "a",
          colClass: "col-md-6",
          label: "Applicant Name (As on Aadhar)",
          required: true,
          component: "RHFTextField",
          name: "applicantName",
          type: "text"
        },
        {
          letter: "b",
          colClass: "col-md-6", 
          label: "Applicant Father/Husband Name",
          required: true,
          component: "RHFTextField",
          name: "applicantFatherHusbandName",
          type: "text",
          fieldType: "name",
          allowTextField: true
        },
        {
          letter: "c",
          colClass: "col-md-6",
          label: "Applicant Address",
          required: true,
          component: "RHFTextarea",
          name: "applicantAddress"
        },
        {
          letter: "d",
          colClass: "col-md-6",
          label: "Name of the Keeper in whose name Licence to be issue",
          required: true,
          component: "RHFTextField", 
          name: "licenseKeeperName",
          type: "text",
          fieldType: "name",
          allowTextField: true
        },
        {
          letter: "E",
          colClass: "col-md-6",
          label: "Picture of the keeper in whose name Licence to be issue",
          component: "RHFFileUpload",
          name: "licenseKeeperPicture",
          allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
          maxSizeInMB: 1,
          accept: ".jpg,.jpeg,.png,.pdf",
          hasDownload: true,
          downloadData: TradeData?.license_keeper_picture
        },
        {
          letter: "F",
          colClass: "col-md-6",
          label: "Aadhar Number",
          required: true,
          component: "RHFTextField",
          name: "aadharNumber",
          type: "number",
          maxLength: 12
        },
        {
          letter: "G",
          colClass: "col-md-6", 
          label: "Picture of aadhar id",
          component: "RHFFileUpload",
          name: "aadharPicture",
          allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
          maxSizeInMB: 1,
          accept: ".jpg,.jpeg,.png,.pdf",
          hasDownload: true,
          downloadData: TradeData?.aadhar_picture
        }
      ]
    },
    {
      sectionNumber: "3",
      title: "ESTABLISHMENT DETAILS",
      fields: [
        {
          letter: "a",
          colClass: "col-md-6",
          label: "Name of Unit/Establishment",
          required: true,
          component: "RHFTextField",
          name: "nameOfUnitEstablishment",
          type: "text",
          fieldType: "name",
          allowTextField: true
        },
        {
          letter: "b",
          colClass: "col-md-6",
          label: "Year of Establishment",
          component: "RHFSelect",
          name: "yearOfEstablishment",
          className: "form-control mt-2 p-2",
          options: Array.from({ length: 35 }, (_, i) => {
            const year = moment().subtract(i, "years").year();
            return { value: year.toString(), label: year.toString() };
          })
        },
        {
          letter: "c",
          colClass: "col-md-6",
          label: "GSTIN No.",
          component: "RHFTextField",
          name: "gstin",
          fieldType: "number",
          maxlength: 12
        },
        {
          letter: "d",
          colClass: "col-md-6",
          label: "TIN No.",
          component: "RHFTextField",
          name: "tinNo",
          type: "text",
          maxLength: 12
        },
        {
          letter: "E",
          colClass: "col-md-6",
          label: "Address of unit",
          required: true,
          component: "RHFTextarea",
          name: "addressOfUnit"
        },
        {
          letter: "F",
          colClass: "col-md-6",
          label: "Pan Card Number",
          component: "RHFTextField",
          name: "panCardNumber",
          type: "text",
          maxLength: 10
        },
        {
          letter: "G",
          colClass: "col-md-6",
          label: "Area",
          required: true,
          component: "RHFSelect",
          name: "areaId",
          options: TradeAreaMasterdata || []
        },
        {
          letter: "H",
          colClass: "col-md-6",
          label: "Locality",
          component: "RHFTextField",
          name: "locality",
          type: "text"
        },
        {
          letter: "H",
          colClass: "col-md-6",
          label: "Pincode",
          required: true,
          component: "RHFTextField",
          name: "pincode",
          type: "number",
          maxLength: 6
        },
        {
          letter: "H",
          colClass: "col-md-6",
          label: "E-Mail Id",
          required: true,
          component: "RHFTextField",
          name: "emailId",
          type: "email",
          fieldType: "email",
          maxLength: 50
        },
        {
          letter: "I",
          colClass: "col-md-6",
          label: "Phone (Mobile)",
          required: true,
          component: "RHFTextField",
          name: "phoneMobile",
          type: "number",
          inputMode: "numeric",
          maxlength: 10
        },
        {
          letter: "J",
          colClass: "col-md-6",
          label: "Electric Connection No.",
          required: true,
          component: "RHFTextField",
          name: "electricConnectionNo",
          type: "text",
          maxlength: 15
        },
        {
          letter: "K",
          colClass: "col-md-6",
          label: "Premises/Property No.",
          required: true,
          component: "RHFTextField",
          name: "premisesPropertyNo",
          type: "text",
          maxlength: 15
        },
        {
          letter: "L",
          colClass: "col-md-6",
          label: "Water Consume No.",
          required: true,
          component: "RHFTextField",
          name: "waterConsumeNo",
          type: "text",
          fieldType: "number",
          maxlength: 10
        },
        {
          letter: "M",
          colClass: "col-md-6",
          label: "status of premises",
          component: "RHFSelect",
          name: "statusOfPremises",
          options: TradePremisesStatusTypeData || []
        },
        {
          letter: "N",
          colClass: "col-md-6",
          label: "Notified Road",
          component: "RHFTextField",
          name: "notifiedRoad",
          type: "text"
        },
        {
          letter: "O",
          colClass: "col-md-6",
          label: "Notified area",
          component: "RHFTextField",
          name: "notifiedArea",
          type: "text"
        }
      ]
    },
    {
      sectionNumber: "4",
      title: "TYPE OF CONSTITUTION",
      fields: [
        {
          letter: "A",
          colClass: "col-md-6",
          label: "Type of Constitution",
          required: true,
          component: "RHFSelect",
          name: "constitutionType",
          options: TradeConstitutionTtypedata || []
        },
        {
          letter: "B",
          colClass: "col-md-6",
          label: "Property title",
          component: "RHFSelect",
          name: "propertyTitle",
          options: TradePropertyTitledata || []
        }
      ],
      hasPartnersTable: true
    },
    {
      sectionNumber: "5",
      title: "PROPERTY DETAIL(UNDER USE IN BUSINESS)",
      fields: [
        {
          letter: "A",
          colClass: "col-md-6",
          label: "Is the Structure Protected Under the Delhi Special Provision Act 2011/14.",
          required: true,
          component: "RHFCheckbox",
          name: "specialProvisionAct2011And2014",
          isSpecialCheckbox: true
        },
        {
          letter: "B",
          colClass: "col-md-6",
          label: "Ownership",
          required: true,
          component: "RHFSelect",
          name: "ownership",
          options: TradeOwnershipMasterdata || []
        }
      ],
      hasFloorsTable: true
    },
    {
      sectionNumber: "6",
      title: "CLASSIFICATION OF TRADE",
      fields: [
        {
          letter: "A",
          colClass: "col-md-6",
          label: "Trade Description",
          required: true,
          component: "RHFSelect",
          name: "tradeDescription",
          options: TradeDiscriptionMasterdata || [],
          onChange: (e) => setTradeDescription(e.target.value)
        },
        {
          letter: "B",
          colClass: "col-md-6",
          label: "License Issue Under Section",
          required: true,
          component: "RHFPasswordField",
          name: "licenseIssueUnderSection",
          typeof: "text",
          value: UnderSection,
          disabled: true
        }
      ]
    }
  ];

  const addPartner = () => {
    setPartners([...partners, { partnerName: '', partnerAadharNumber: '', partnerAddress: '' }]);
  };

  const removePartner = (index, partner) => {
    setPartners(partners.filter((_, i) => i !== index));
  };

  const addFloor = () => {
    setFloors([...floors, { floorId: '', coveredAreaOfFloor: '', unitAreaInSquareMtr: '' }]);
  };

  const removeFloor = (index, floor) => {
    setFloors(floors.filter((_, i) => i !== index));
  };

  const renderFieldComponent = (field) => {
    const baseProps = {
      name: field.name,
      label: field.component === "RHFFileUpload" ? field.name : `${field.label}${field.required ? ' *' : ''}`,
      ...(field.type && { type: field.type }),
      ...(field.maxLength && { maxLength: field.maxLength }),
      ...(field.maxlength && { maxlength: field.maxlength }),
      ...(field.fieldType && { fieldType: field.fieldType }),
      ...(field.allowTextField && { allowTextField: field.allowTextField }),
      ...(field.inputMode && { inputMode: field.inputMode }),
      ...(field.options && { options: field.options }),
      ...(field.onChange && { onChange: field.onChange }),
      ...(field.className && { className: field.className }),
      ...(field.maxDateToday && { maxDateToday: field.maxDateToday }),
      ...(field.allowedTypes && { allowedTypes: field.allowedTypes }),
      ...(field.maxSizeInMB && { maxSizeInMB: field.maxSizeInMB }),
      ...(field.accept && { accept: field.accept }),
      ...(field.value && { value: field.value }),
      ...(field.disabled && { disabled: field.disabled }),
      ...(field.typeof && { typeof: field.typeof })
    };

    switch (field.component) {
      case "RHFRadioGroup":
        return <RHFRadioGroup {...baseProps} />;
      case "RHFTextField":
        return <RHFTextField {...baseProps} />;
      case "RHFTextarea":
        return <RHFTextarea {...baseProps} />;
      case "RHFDatePicker":
        return <RHFDatePicker {...baseProps} />;
      case "RHFSelect":
        return <RHFSelect {...baseProps} />;
      case "RHFFileUpload":
        return <RHFFileUpload {...baseProps} />;
      case "RHFCheckbox":
        return <RHFCheckbox {...baseProps} />;
      case "RHFPasswordField":
        return <RHFPasswordField {...baseProps} />;
      default:
        return null;
    }
  };

  const renderFileUploadWithDownload = (field) => {
    const hasExistingFile = field.downloadData && field.downloadData !== "" && field.downloadData !== null;
    
    return (
      <div className="col-md-8">
        <div className="col-md-8">
          <div className=" d-flex">
            {hasExistingFile ? (
              <>
                <a
                  onClick={() => {
                    postbirthCertificateDatafn2({
                      id: field.downloadData,
                    });
                  }}
                  className="text-primary d-flex align-items-center mt-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      stroke="none"
                      d="M0 0h24v24H0z"
                      fill="none"
                    />
                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                    <path d="M12 17v-6" />
                    <path d="M9.5 14.5l2.5 2.5l2.5 -2.5" />
                  </svg>
                </a>
                <span>
                  {renderFieldComponent(field)}
                </span>
              </>
            ) : (
              <div className="col-md-12">
                {renderFieldComponent(field)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render individual field
  const renderField = (field) => {
    if (field.isSpecialCheckbox) {
      return (
        <div key={field.name} className={field.colClass}>
          <div className="row align-items-center mb-3">
            <div className="col-md-1">
              <label className="form-label mb-md-0">({field.letter})</label>
            </div>
            <div className="col-md-8">
              <label className="form-label mb-md-0">
                {field.label}{field.required && <span style={{ color: "red" }}>&nbsp;*</span>}
              </label>
            </div>
            <div className="col-md-2">
              {renderFieldComponent(field)}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={field.name} className={field.colClass}>
        <div className="row align-items-center mb-3">
          <div className="col-md-1">
            <label className="form-label mb-md-0">({field.letter})</label>
          </div>
          <div className="col-md-3">
            <label className="form-label mb-md-0">
              {field.label}{field.required && <span style={{ color: "red" }}>&nbsp;*</span>}
            </label>
          </div>
          {field.hasDownload ? 
            renderFileUploadWithDownload(field) :
            <div className="col-md-8">
              {renderFieldComponent(field)}
            </div>
          }
        </div>
      </div>
    );
  };

  // Render license type field
  const renderLicenseTypeField = () => (
    <div className={licenseTypeField.colClass}>
      <div className="row align-items-center mb-3">
        <div className="col-md-1">
          <label className="form-label mb-md-0">{licenseTypeField.number}.</label>
        </div>
        <div className={licenseTypeField.labelColClass}>
          <label className="form-label mb-md-0">
            {licenseTypeField.label}{licenseTypeField.required && <span style={{ color: "red" }}>&nbsp;*</span>}
          </label>
        </div>
        <div className={licenseTypeField.inputColClass}>
          {renderFieldComponent(licenseTypeField)}
        </div>
      </div>
    </div>
  );

  // Render section header
  const renderSectionHeader = (section) => (
    <div key={`header-${section.sectionNumber}`} className="col-md-12">
      <div className="row align-items-center mb-3 title-background text-center">
        <div className="col-md-1">
          <label className="form-label mb-md-0"></label>
        </div>
        <div className="col-md-11">
          <label className="form-label mb-md-0">{section.sectionNumber}.{section.title}</label>
          {section.subtitle && (
            <label className="mb-md-0">&nbsp;{section.subtitle}</label>
          )}
        </div>
      </div>
    </div>
  );

  // Render partners table
  const renderPartnersTable = () => (
    <div key="partners-table" className="w-full mb-4 col-md-12">
      <h3 className="w-full font-medium mb-2">Partners Information</h3>
      <div className="w-full">
        <table className="w-full border border-gray-300" style={{ width: "100%" }}>
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">S.No.</th>
              <th className="border border-gray-300 p-2 text-left">Name</th>
              <th className="border border-gray-300 p-2 text-left">Voter ID/Aadhaar No</th>
              <th className="border border-gray-300 p-2 text-left">Address</th>
              <th className="border border-gray-300 p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((partner, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">
                  <RHFTextField
                    name={`partners.${index}.partnerName`}
                    label=""
                    type="text"
                    fieldType="name"
                    allowTextField={true}
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <RHFTextField
                    name={`partners.${index}.partnerAadharNumber`}
                    label=""
                    type="number"
                    maxLength={12}
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <RHFTextarea name={`partners.${index}.partnerAddress`} label="" />
                </td>
                <td className="border border-gray-300 p-2">
                  {partners.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePartner(index, partner)}
                      className="submit-btn btn btn-danger btn-md me-2 mb-4 mt-1"
                    >
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={addPartner}
        className="submit-btn btn btn-secondary btn-md me-2 mb-4 mt-1"
      >
        Add Partner
      </button>
    </div>
  );

  // Render floors table
  const renderFloorsTable = () => (
    <div key="floors-table" className="mb-4 col-md-12">
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300" style={{ width: "100%" }}>
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">S.No.</th>
              <th className="border border-gray-300 p-2 text-left">Floor Name</th>
              <th className="border border-gray-300 p-2 text-left">Covered Area of Floor</th>
              <th className="border border-gray-300 p-2 text-left">Unit Area in Square Mtr.</th>
              <th className="border border-gray-300 p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {floors.map((floor, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">
                  <RHFSelect
                    name={`floors.${index}.floorId`}
                    label=""
                    options={TradeFloorMasterdata || []}
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <RHFTextField
                    name={`floors.${index}.coveredAreaOfFloor`}
                    label=""
                    typeof="text"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <RHFTextField
                    name={`floors.${index}.unitAreaInSquareMtr`}
                    label=""
                    typeof="text"
                  />
                </td>
                <td className="border bg-red p-2">
                  {floors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFloor(index, floor)}
                      className="submit-btn btn btn-danger btn-md me-2 mb-4 mt-1"
                    >
                      <RiDeleteBin5Line />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={addFloor}
        className="submit-btn btn btn-secondary btn-md me-2 mb-4 mt-1"
      >
        Add Floor
      </button>
    </div>
  );

  const RHFRadioGroup = ({ name, label, options }) => (
    <div>
      {options.map((option, idx) => (
        <div key={idx} className="form-check">
          <input className="form-check-input" type="radio" name={name} value={option.value} />
          <label className="form-check-label">{option.label}</label>
        </div>
      ))}
    </div>
  );

  const RHFTextField = ({ name, label, type = "text", maxLength, fieldType, allowTextField, inputMode, maxlength }) => (
    <input 
      className="form-control" 
      type={type} 
      name={name} 
      placeholder={label}
      maxLength={maxLength || maxlength}
      inputMode={inputMode}
    />
  );

  const RHFTextarea = ({ name, label }) => (
    <textarea className="form-control" name={name} placeholder={label}></textarea>
  );

  const RHFDatePicker = ({ name, label, maxDateToday }) => (
    <input className="form-control" type="date" name={name} placeholder={label} />
  );

  const RHFSelect = ({ name, label, options = [], onChange, className }) => (
    <select className={className || "form-control"} name={name} onChange={onChange}>
      <option value="">{label}</option>
      {options.map((option, idx) => (
        <option key={idx} value={option.value}>{option.label}</option>
      ))}
    </select>
  );

  const RHFFileUpload = ({ name, label, allowedTypes, maxSizeInMB, accept }) => (
    <input className="form-control" type="file" name={name} accept={accept} />
  );

  const RHFCheckbox = ({ name, label }) => (
    <div className="form-check">
      <input className="form-check-input" type="checkbox" name={name} />
      <label className="form-check-label">{label}</label>
    </div>
  );

  const RHFPasswordField = ({ name, label, value, disabled, typeof }) => (
    <input 
      className="form-control" 
      type="text" 
      name={name} 
      value={value}
      disabled={disabled}
      placeholder={label}
    />
  );

  return (
    <div className="row">
      <span className="row text-center mb-12">
        <b>Health License Registration Form</b>
      </span>

      {renderLicenseTypeField()}

      {watch("licenseTypeId") == 2 && renewalFields.map(renderField)}

      {formSections.map((section) => [
        renderSectionHeader(section),
        section.fields.map(renderField),
        section.hasPartnersTable && renderPartnersTable(),
        section.hasFloorsTable && renderFloorsTable()
      ])}
    </div>
  );
};

export default HealthLicenseForm;