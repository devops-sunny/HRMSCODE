import React from 'react';
import {
  ViewIcon,
  NDMCApplicationChallanIcon,
  RupeeCircleIcon,
  DocumentCollectionIcon,
  InspectionFormIcon,
  DocumentVerificationIcon,
  EditIcon,
  ForwardArrowIcon,
  SendBackArrowIcon,
  ApprovedIcon,
  RejectedIcon,
} from './Icons'; // Adjust import path
import { IoInformationCircle } from 'react-icons/io5';

// Types
interface RowData {
  original: {
    id: string;
    status_id: string;
    challan_id?: string | null;
    is_challan_fee?: boolean;
    to_role_id: number;
    application_inspection_status?: boolean;
    feecalculation_id?: string | null;
    da_userid?: number | null;
    [key: string]: any;
  };
  index: number;
}

interface ActionButtonProps {
  row: RowData;
  Role: string | number;
  user?: { id: number };
  onAction?: (data: any) => void;
}

// ==========================================
// 1. VIEW BUTTON COMPONENT
// ==========================================
export const ViewActionButton: React.FC<ActionButtonProps & { 
  onView: (row: RowData) => void 
}> = ({ row, onView }) => {
  return (
    <ViewIcon 
      onClick={() => onView(row)}
      title="View Details" 
    />
  );
};

// ==========================================
// 2. NDMC CHALLAN BUTTON COMPONENT
// ==========================================
export const NDMCChallanButton: React.FC<ActionButtonProps & {
  onChallan: (rowData: any) => void;
}> = ({ row, Role, onChallan }) => {
  const shouldShow = Number(Role) === 18 && 
    row.original.status_id === "Approved" && 
    row.original.challan_id == null;

  if (!shouldShow) return null;

  return (
    <NDMCApplicationChallanIcon
      onClick={() => onChallan(row.original)}
      title="Generate Challan"
    />
  );
};

// ==========================================
// 3. CHALLAN FEE BUTTON COMPONENT
// ==========================================
export const ChallanFeeButton: React.FC<ActionButtonProps & {
  onChallanFee: (rowData: any) => void;
}> = ({ row, onChallanFee }) => {
  const shouldShow = row.original.is_challan_fee !== true && 
    row.original.status_id === "Approved";

  if (!shouldShow) return null;

  return (
    <RupeeCircleIcon
      title="Challan Fee"
      onClick={() => onChallanFee(row.original)}
    />
  );
};

// ==========================================
// 4. DOCUMENT COLLECTION BUTTON COMPONENT
// ==========================================
export const DocumentCollectionButton: React.FC<ActionButtonProps & {
  onDocumentCollection: (rowData: any) => void;
}> = ({ row, Role, onDocumentCollection }) => {
  const shouldShow = Number(Role) === 1 && 
    Number(row.original.to_role_id) === 1 && 
    row.original.status_id === "Deficiency";

  if (!shouldShow) return null;

  return (
    <DocumentCollectionIcon
      onClick={() => onDocumentCollection(row.original)}
      title="Document Collection"
    />
  );
};

// ==========================================
// 5. INSPECTION FORM BUTTON COMPONENT
// ==========================================
export const InspectionFormButton: React.FC<ActionButtonProps & {
  onInspection: (rowData: any) => void;
}> = ({ row, Role, onInspection }) => {
  const shouldShow = !row.original.application_inspection_status && 
    (Number(Role) === 21 || Number(Role) === 22 || Number(Role) === 23);

  if (!shouldShow) return null;

  return (
    <InspectionFormIcon
      onClick={() => onInspection(row.original)}
      title="Inspection Form"
    />
  );
};

// ==========================================
// 6. DOCUMENT VERIFICATION BUTTON COMPONENT
// ==========================================
export const DocumentVerificationButton: React.FC<ActionButtonProps & {
  onDocumentVerification: (rowData: any) => void;
}> = ({ row, Role, user, onDocumentVerification }) => {
  const shouldShow = row.original.feecalculation_id == null &&
    row.original.application_inspection_status === false &&
    Number(row.original.to_role_id) === Number(Role);

  if (!shouldShow) return null;

  // Role-specific visibility logic
  const isVisible = (() => {
    if (Number(Role) === 18) {
      return row.original.da_userid == null || 
        Number(row.original.da_userid) === user?.id;
    }
    return Number(Role) === 19 || Number(Role) === 20;
  })();

  if (!isVisible) return null;

  return (
    <DocumentVerificationIcon
      onClick={() => onDocumentVerification(row.original)}
      title="Document Verification"
    />
  );
};

// ==========================================
// 7. EDIT BUTTON COMPONENT
// ==========================================
export const EditActionButton: React.FC<ActionButtonProps & {
  onEdit: (rowData: any) => void;
}> = ({ row, Role, onEdit }) => {
  const shouldShow = (row.original.status_id === "Drafted" ||
    (row.original.status_id === "SendBack" &&
      Number(row.original.to_role_id) === Number(Role))) &&
    Number(Role) === 1;

  if (!shouldShow) return null;

  return (
    <EditIcon
      title="Edit Trade Registration"
      onClick={() => onEdit(row.original)}
    />
  );
};

// ==========================================
// 8. FORWARD ARROW BUTTON COMPONENT
// ==========================================
export const ForwardActionButton: React.FC<ActionButtonProps & {
  onForward: (rowData: any) => void;
}> = ({ row, Role, user, onForward }) => {
  const shouldShow = (row.original.status_id === "Forwarded" ||
    row.original.status_id === "Verified" ||
    row.original.status_id === "SendBack") &&
    Number(row.original.to_role_id) === Number(Role) &&
    Number(Role) !== 1;

  if (!shouldShow) return null;

  // Role 18 specific logic
  if (Number(Role) === 18) {
    const canForward = row.original.da_userid == null ||
      Number(row.original.da_userid) === user?.id;
    
    if (!canForward) return null;
  }

  return (
    <ForwardArrowIcon
      onClick={() => onForward(row.original)}
      title="Forward Application"
    />
  );
};

// ==========================================
// 9. SEND BACK BUTTON COMPONENT
// ==========================================
export const SendBackActionButton: React.FC<ActionButtonProps & {
  onSendBack: (rowData: any) => void;
}> = ({ row, Role, user, onSendBack }) => {
  const shouldShow = (row.original.status_id === "Forwarded" ||
    row.original.status_id === "Verified" ||
    row.original.status_id === "SendBack") &&
    Number(row.original.to_role_id) === Number(Role) &&
    Number(Role) !== 1;

  if (!shouldShow) return null;

  // Role 18 specific logic
  if (Number(Role) === 18) {
    const canSendBack = row.original.da_userid == null ||
      Number(row.original.da_userid) === user?.id;
    
    if (!canSendBack) return null;
  }

  return (
    <SendBackArrowIcon
      onClick={() => onSendBack(row.original)}
      title="Send Back Application"
    />
  );
};

// ==========================================
// 10. FEE CALCULATION INFO BUTTON COMPONENT
// ==========================================
export const FeeCalculationInfoButton: React.FC<ActionButtonProps & {
  onFeeInfo: (rowData: any, feeCalculationId: string) => void;
}> = ({ row, Role, user, onFeeInfo }) => {
  const shouldShow = (Number(Role) === 18 || Number(Role) === 24) &&
    Number(Role) === row.original.to_role_id &&
    row.original.application_inspection_status === true &&
    row.original.feecalculation_id;

  if (!shouldShow) return null;

  if (Number(Role) === 18) {
    const canView = row.original.da_userid == null ||
      Number(row.original.da_userid) === user?.id;
    
    if (!canView) return null;
  }

  return (
    <IoInformationCircle
      style={{ fontSize: "30px", cursor: "pointer" }}
      onClick={() => onFeeInfo(row.original, row.original.feecalculation_id)}
      title="Fee Calculation Info"
    />
  );
};


export const FeeCalculationButton: React.FC<ActionButtonProps & {
  onFeeCalculation: (id: string) => void;
}> = ({ row, Role, user, onFeeCalculation }) => {
  const shouldShow = (Number(Role) === 18 || Number(Role) === 24) &&
    Number(Role) === row.original.to_role_id &&
    row.original.application_inspection_status === true;

  if (!shouldShow) return null;

  // Role 18 specific logic
  if (Number(Role) === 18) {
    const canCalculate = row.original.da_userid == null ||
      Number(row.original.da_userid) === user?.id;
    
    if (!canCalculate) return null;
  }

  return (
    <RupeeCircleIcon
      onClick={() => onFeeCalculation(row.original.id)}
      title="Calculate Fee"
    />
  );
};


export const ApprovalRejectionButtons: React.FC<ActionButtonProps & {
  onApprove: (rowData: any) => void;
  onReject: (rowData: any) => void;
}> = ({ row, Role, onApprove, onReject }) => {
  const shouldShow = row.original.feecalculation_id !== null &&
    row.original.application_inspection_status === true &&
    Number(row.original.to_role_id) === Number(Role) &&
    Number(Role) === 20;

  if (!shouldShow) return null;

  return (
    <>
      <ApprovedIcon
        onClick={() => onApprove(row.original)}
        title="Approve Application"
      />
      &nbsp;&nbsp;&nbsp;
      <RejectedIcon
        onClick={() => onReject(row.original)}
        title="Reject Application"
      />
    </>
  );
};


export const ActionButtonsContainer: React.FC<{
  row: RowData;
  Role: string | number;
  user?: { id: number };
  handlers: {
    handleMoreDataClick: (row: RowData) => void;
    setChallanId: (value: boolean) => void;
    setrowData: (data: any) => void;
    setShowRupee: (value: boolean) => void;
    setDocumentVerificationFileshow: (value: boolean) => void;
    setInspectionShow: (value: boolean) => void;
    setDocumentVerificationShow: (value: boolean) => void;
    navigator: (path: string) => void;
    setTradeData: (data: any) => void;
    setShow: (value: boolean) => void;
    setData: (data: any) => void;
    setstatusId: (status: string) => void;
    handleRupeeClick1: (feeId: string) => void;
    handleRupeeClick: (id: string) => void;
  };
}> = ({ row, Role, user, handlers }) => {
  return (
    <>
      <ViewActionButton 
        row={row} 
        Role={Role} 
        onView={handlers.handleMoreDataClick} 
      />
      &nbsp;&nbsp;&nbsp;

      <NDMCChallanButton
        row={row}
        Role={Role}
        onChallan={(rowData) => {
          handlers.setChallanId(true);
          handlers.setrowData(rowData);
        }}
      />

      <ChallanFeeButton
        row={row}
        Role={Role}
        onChallanFee={(rowData) => {
          handlers.setrowData(rowData);
          handlers.setShowRupee(true);
        }}
      />
      &nbsp;&nbsp;&nbsp;

      <DocumentCollectionButton
        row={row}
        Role={Role}
        onDocumentCollection={(rowData) => {
          handlers.setrowData(rowData);
          handlers.setDocumentVerificationFileshow(true);
        }}
      />
      &nbsp;&nbsp;&nbsp;

      <InspectionFormButton
        row={row}
        Role={Role}
        onInspection={(rowData) => {
          handlers.setInspectionShow(true);
          handlers.setrowData(rowData);
        }}
      />
      &nbsp;&nbsp;&nbsp;

      <DocumentVerificationButton
        row={row}
        Role={Role}
        user={user}
        onDocumentVerification={(rowData) => {
          handlers.setrowData(rowData);
          handlers.setDocumentVerificationShow(true);
        }}
      />
      &nbsp;&nbsp;&nbsp;

      <EditActionButton
        row={row}
        Role={Role}
        onEdit={(rowData) => {
          handlers.navigator("/tradeLicenseRegistrationForm");
          handlers.setTradeData(rowData);
        }}
      />
      &nbsp;&nbsp;&nbsp;

      <ForwardActionButton
        row={row}
        Role={Role}
        user={user}
        onForward={(rowData) => {
          handlers.setShow(true);
          handlers.setData(rowData);
          handlers.setstatusId("Forwarded");
        }}
      />
      &nbsp;&nbsp;&nbsp;

      <FeeCalculationInfoButton
        row={row}
        Role={Role}
        user={user}
        onFeeInfo={(rowData, feeId) => {
          handlers.setData(rowData);
          handlers.setrowData(rowData);
          handlers.handleRupeeClick1(feeId);
        }}
      />
      &nbsp;&nbsp;&nbsp;

      <FeeCalculationButton
        row={row}
        Role={Role}
        user={user}
        onFeeCalculation={handlers.handleRupeeClick}
      />

      <ApprovalRejectionButtons
        row={row}
        Role={Role}
        onApprove={(rowData) => {
          handlers.setShow(true);
          handlers.setData(rowData);
          handlers.setstatusId("Approved");
        }}
        onReject={(rowData) => {
          handlers.setShow(true);
          handlers.setData(rowData);
          handlers.setstatusId("Rejected");
        }}
      />
    </>
  );
};

// ==========================================
// SIMPLIFIED COLUMN DEFINITION
// ==========================================
export const getOptimizedColumns = (
  columnHelper: any,
  activePage: number,
  pageSize: number,
  Role: string | number,
  user: { id: number },
  handlers: any,
  getDataColumns: any,
  setTracking: any,
  setTrackingData: any
) => [
  columnHelper.accessor("id", {
    header: "Sr. No",
    cell: (ctx: any) => activePage * pageSize + ctx.row.index + 1,
    minSize: 10,
    size: 20,
  }),
  columnHelper.accessor("view", {
    header: "Action",
    size: 180,
    cell: ({ row }: { row: RowData }) => (
      <ActionButtonsContainer
        row={row}
        Role={Role}
        user={user}
        handlers={handlers}
      />
    ),
  }),
  ...getDataColumns(columnHelper, setTracking, setTrackingData),
];

















import React, { useState } from 'react';

































const createTradeQuery = (queryFn: () => Promise<any>, key: string) => ({
  queryKey: [key],
  queryFn,
  staleTime: 5 * 60 * 1000,
  cacheTime: 10 * 60 * 1000,
  refetchOnWindowFocus: false,
  retry: 2,
});

export const useTradeQueriesUtility = () => {
  const queryConfigs = [
    createTradeQuery(TradePropertyTitle, "TradePropertyTitle"),
    createTradeQuery(TradeOwnershipMaster, "TradeOwnershipMaster"),
    createTradeQuery(TradeLicenseTypeMaster, "TradeLicenseTypeMaster"),
    createTradeQuery(TradeFloorMaster, "TradeFloorMaster"),
    createTradeQuery(TradeConstitutionTtype, "TradeConstitutionType"),
    createTradeQuery(TradeDiscriptionMaster, "TradeDiscriptionMaster"),
    createTradeQuery(TradeAreaMaster, "TradeAreaMaster"),
    createTradeQuery(TradePremisesStatusType, "TradePremisesStatusType"),
  ];

  const queries = useQueries({ queries: queryConfigs });

  return {
    TradePropertyTitledata: queries[0].data,
    TradeOwnershipMasterdata: queries[1].data,
    TradeLicenseTypeMasterdata: queries[2].data,
    TradeFloorMasterdata: queries[3].data,
    TradeConstitutionTtypedata: queries[4].data,
    TradeDiscriptionMasterdata: queries[5].data,
    TradeAreaMasterdata: queries[6].data,
    TradePremisesStatusTypeData: queries[7].data,
    isLoading: queries.some(q => q.isLoading),
    isError: queries.some(q => q.isError),
    errors: queries.filter(q => q.error).map(q => q.error),
  };
};




  const {
    TradePropertyTitledata,
    TradeOwnershipMasterdata,
    TradeLicenseTypeMasterdata,
    TradeFloorMasterdata,
    TradeConstitutionTtypedata,
    TradeDiscriptionMasterdata,
    TradeAreaMasterdata,
    TradePremisesStatusTypeData,
    isLoading,
    isError,
  } = useTradeQueriesUtility();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;













const currentValidationSchema = useMemo(() => {
    switch (state.currentStep) {
      case 1: return validationSchema;
      case 2: return validationSchema2;
      case 3: return validationSchema3;
      default: return validationSchema;
    }
  }, [state.currentStep]);

  // Form setup
  const methods = useForm<TradeLicenseFormValues>({
    resolver: yupResolver(currentValidationSchema),
    defaultValues,
    mode: 'onChange', // Enable real-time validation
  });










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















 const getColumns = () => [
    columnHelper.accessor("id", {
      header: "Sr. No",
      cell: (ctx) => activePage * pageSize + ctx.row.index + 1,
      minSize: 10,
      size: 20,
    }),
    columnHelper.accessor("view", {
      header: "Action",
      size: 180,

      cell: ({ row }: any) => {
        return (
          <>
            <ViewIcon onClick={() => handleMoreDataClick(row)} />
            &nbsp;&nbsp;&nbsp;
            {Number(Role) == 18 &&
              row.original.status_id == "Approved" &&
              row.original.challan_id == null && (
                <>
                  <NDMCApplicationChallanIcon
                    onClick={() => {
                      setChallanId(true);
                      setrowData(row.original);
                    }}
                  />
                </>
              )}
            {row.original.is_challan_fee !== true &&
              row.original.status_id == "Approved" && (
                <>
                  <RupeeCircleIcon
                    title="Challan Fee"
                    onClick={() => {
                      setrowData(row.original);
                      setShowRupee(true);
                    }}
                  />
                </>
              )}
            &nbsp;&nbsp;&nbsp;
            {Number(Role) == 1 &&
              Number(row.original.to_role_id) == 1 &&
              row.original.status_id == "Deficiency" && (
                <>
                  <DocumentCollectionIcon
                    onClick={() => {
                      setrowData(row.original);
                      setDocumentVerificationFileshow(true);
                    }}
                  />
                </>
              )}
            &nbsp;&nbsp;&nbsp;
            {!row.original.application_inspection_status && (
              <>
                {(Number(Role) == 21 ||
                  Number(Role) == 22 ||
                  Number(Role) == 23) && (
                  <>
                    <InspectionFormIcon
                      onClick={() => {
                        setInspectionShow(true);
                        setrowData(row.original);
                      }}
                    />
                  </>
                )}
              </>
            )}
            &nbsp;&nbsp;&nbsp;
            {row.original.feecalculation_id == null &&
              row.original.application_inspection_status == false &&
              Number(row.original.to_role_id) === Number(Role) && (
                <>
                  {Number(Role) === 18
                    ? (row.original.da_userid == null ||
                        Number(row.original.da_userid) ===
                          (user as any)?.id) && (
                        // If Role is 18
                        <DocumentVerificationIcon
                          onClick={() => {
                            setrowData(row.original);
                            setDocumentVerificationShow(true);
                          }}
                        />
                      )
                    : // If Role is  19, or 20
                      (Number(Role) === 19 || Number(Role) === 20) && (
                        <DocumentVerificationIcon
                          onClick={() => {
                            setrowData(row.original);
                            setDocumentVerificationShow(true);
                          }}
                        />
                      )}
                </>
              )}
            &nbsp;&nbsp;&nbsp;
            {(row.original.status_id == "Drafted" ||
              (row.original.status_id == "SendBack" &&
                Number(row.original.to_role_id) == Number(Role))) &&
              Number(Role) == 1 && (
                <>
                  <EditIcon
                    title="Edit Trade Registration"
                    onClick={() => {
                      navigator("/tradeLicenseRegistrationForm");
                      setTradeData(row.original);
                    }}
                  />
                </>
              )}
            &nbsp;&nbsp;&nbsp;
            {(row.original.status_id == "Forwarded" ||
              row.original.status_id == "Verified" ||
              row.original.status_id == "SendBack") &&
              Number(row.original.to_role_id) == Number(Role) && (
                <>
                  &nbsp;&nbsp;&nbsp;
                  {!(Number(Role) === 1) && (
                    <>
                      {Number(Role) === 18 ? (
                        <>
                          {(row.original.da_userid == null ||
                            Number(row.original.da_userid) ===
                              (user as any)?.id) && (
                            <ForwardArrowIcon
                              onClick={() => {
                                setShow(true);
                                setData(row.original);
                                setstatusId("Forwarded");
                              }}
                            />
                          )}
                        </>
                      ) : (
                        <ForwardArrowIcon
                          onClick={() => {
                            setShow(true);
                            setData(row.original);
                            setstatusId("Forwarded");
                          }}
                        />
                      )}
                    </>
                  )}
                  &nbsp;&nbsp;&nbsp;
                  {/* {!(Number(Role) === 1) && (
                    <>
                      {Number(Role) === 18 ? (
                        <>
                          {(row.original.da_userid == null ||
                            Number(row.original.da_userid) ===
                              (user as any)?.id) && (
                            <SendBackArrowIcon
                              onClick={() => {
                                setShow(true);
                                setData(row.original);
                                setstatusId("SendBack");
                              }}
                            />
                          )}
                        </>
                      ) : (
                        <SendBackArrowIcon
                          onClick={() => {
                            setShow(true);
                            setData(row.original);
                            setstatusId("SendBack");
                          }}
                        />
                      )}
                    </>
                  )} */}
                </>
              )}
            {(Number(Role) == 18 || Number(Role) == 24) &&
            Number(Role) == row.original.to_role_id &&
            row.original.application_inspection_status == true ? (
              <>
                {row.original.feecalculation_id ? (
                  <>
                    {Number(Role) == 18 ? (
                      <>
                        {(row.original.da_userid == null ||
                          Number(row.original.da_userid) ===
                            (user as any)?.id) && (
                          <>
                            <IoInformationCircle
                              style={{ fontSize: "30px", cursor: "pointer" }}
                              onClick={() => {
                                setData(row.original);
                                setrowData(row.original);
                                handleRupeeClick1(
                                  row.original.feecalculation_id
                                );
                              }}
                            />
                            &nbsp;&nbsp;&nbsp;
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <>
                          <IoInformationCircle
                            style={{ fontSize: "30px", cursor: "pointer" }}
                            onClick={() => {
                              setData(row.original);
                              setrowData(row.original);
                              handleRupeeClick1(row.original.feecalculation_id);
                            }}
                          />
                          &nbsp;&nbsp;&nbsp;
                        </>
                      </>
                    )}
                  </>
                ) : (
                  <> </>
                )}
                &nbsp;&nbsp;&nbsp;
              </>
            ) : (
              <></>
            )}
            &nbsp;&nbsp;&nbsp;
            {(Number(Role) == 18 || Number(Role) == 24) &&
            Number(Role) == row.original.to_role_id &&
            row.original.application_inspection_status == true ? (
              <>
                <>
                  {Number(Role) == 18 ? (
                    <>
                      {(row.original.da_userid == null ||
                        Number(row.original.da_userid) ===
                          (user as any)?.id) && (
                        <>
                          <RupeeCircleIcon
                            onClick={() => handleRupeeClick(row.original.id)}
                          />
                          &nbsp;&nbsp;&nbsp;
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <>
                        <RupeeCircleIcon
                          onClick={() => handleRupeeClick(row.original.id)}
                        />
                        &nbsp;&nbsp;&nbsp;
                      </>
                    </>
                  )}
                </>
                &nbsp;&nbsp;&nbsp;
              </>
            ) : (
              <></>
            )}
            {row.original.feecalculation_id !== null &&
              row.original.application_inspection_status === true &&
              Number(row.original.to_role_id) === Number(Role) &&
              Number(Role) === 20 && (
                <>
                  <ApprovedIcon
                    onClick={() => {
                      setShow(true);
                      setData(row.original);
                      setstatusId("Approved");
                    }}
                  />
                  &nbsp;&nbsp;&nbsp;
                  <RejectedIcon
                    onClick={() => {
                      setShow(true);
                      setData(row.original);
                      setstatusId("Rejected");
                    }}
                  />
                </>
              )}
          </>
        );
      },
    }),
    ...getDataColumns(columnHelper, setTracking, setTrackingData),