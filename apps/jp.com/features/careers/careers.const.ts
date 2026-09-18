import {
  ApplicantAccidentHistoryType,
  ApplicantAddressType,
  ApplicantAuthorizationType,
  ApplicantDetailsType,
  ApplicantDrivingExperienceType,
  ApplicantEducationType,
  ApplicantEmployementType,
  ApplicantLicenseType,
  ApplicantTrafficConvictionsType,
} from "@/features/careers/careers.schema"

export const applicantDetail: ApplicantDetailsType = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  dob: "",
  socialSecurity: "",
  availableStartDate: "",
  hasLegalRights: "yes",
  location: "",
}
export const applicantAddress: ApplicantAddressType = {
  currentAddress: {
    street: "",
    city: "",
    state: "",
    zip: "",
    yearsAtAddress: "",
  },
  mailingAddress: {
    street: "",
    city: "",
    state: "",
    zip: "",
    yearsAtAddress: "",
  },
  addresses: [],
}
export const applicantLicence: ApplicantLicenseType = {
  currentLicense: {
    state: "",
    licenseType: "",
    licenseNumber: "",
    endorsements: "",
    expiryDate: "",
  },
  licenses: [],
}

export const applicantExperience: ApplicantEmployementType = {
  experience: [
    {
      employerName: "",
      phone: "",
      address: "",
      position: "",
      fromDate: "",
      toDate: "",
      reasonForLeaving: "",
      safetySensitive: "",
      subjectToFmcsa: "",
      gap: "",
      salary: "",
    },
  ],
}
export const applicantEducation: ApplicantEducationType = {
  highSchool: {
    institutionName: "",
    fieldOfStudy: "",
    location: "",
    yearCompleted: "",
    details: "",
  },
  collage: {
    institutionName: "",
    fieldOfStudy: "",
    location: "",
    yearCompleted: "",
    details: "",
  },
  otherEducations: [
    {
      institutionName: "",
      fieldOfStudy: "",
      location: "",
      yearCompleted: "",
      details: "",
    },
  ],
}

export const applicantConfirmation: ApplicantAuthorizationType = {
  applicantName: "",
  declaration: false,
  drivingLicenseBack: undefined as any,
  drivingLicenseFront: undefined as any,
  socialSecurityBack: undefined as any,
  socialSecurityFront: undefined as any,
  dotFront: undefined as any,
  dotBack: undefined as any,
  signature: undefined as any,
}

export const applicantDrivingExperience: ApplicantDrivingExperienceType = {
  drivingExperiences: [
    {
      category: "",
      type: "",
      fromDate: "",
      toDate: "",
      approxMilesTotal: "",
    },
  ],
}

export const applicantAccidentHistory: ApplicantAccidentHistoryType = {
  accidentHistory: [],
}

export const applicantTrafficConvictions: ApplicantTrafficConvictionsType = {
  trafficConvictions: [],
}

export const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
  "District of Columbia",
]

export const CDL_CLASSES = [
  "Class C",
  "Class D",
  "CDL A",
  "CDL B",
  "Chauffeur's License",
  "State-issued Identification Card",
]

export const CDL_ENDORSEMENTS = [
  "None",
  "Hazardous Materials (H)",
  "Tank Vehicle (N)",
  "Double / Triple Trailers (T)",
  "Passenger (P)",
  "School Bus (S)",
]

export const EQUEPMENT_CATGORIES = [
  "Straight Truck",
  "Tractor (Combination Vehicle)",
  "Bus / Passenger Vehicle",
  "Other",
]

export const EQUIPMENT_TYPES = [
  "Van / Box Truck",
  "Flatbed Truck",
  "Tractor & Semi-Trailer",
  "Tractor & Double Trailers",
  "Tractor & Tanker",
  "Passenger Bus",
  "Other (Specify)",
]
