import { DriverForm } from "./forms/driver-form"
import { TerritoryManagerForm } from "./forms/territory-manager-form"

export const OPEN_POSITIONS = [
  {
    title: "Office Administrator",
    location: "Alabama / Louisiana",
    tags: [],
    href: "office-administrator",
    description:
      "The Office Administrator is responsible for ensuring smooth day-to-day office operations, supporting staff, managing administrative processes, and maintaining an organized and efficient workplace environment.",
    details: `
### Key Responsibilities:
- Manage daily office operations and administrative tasks
- Coordinate schedules, meetings, and office communications
- Maintain organized filing systems and accurate records
- Handle incoming calls, emails, and correspondence
- Support internal teams with documentation and reporting
- Monitor office supplies and coordinate orders as needed
- Assist with onboarding and general HR administrative support
### Qualifications:
- Previous administrative or office support experience preferred
- Strong organizational and multitasking abilities
- Excellent communication and interpersonal skills
- Proficiency in Microsoft Office and basic office software
- Detail-oriented with strong problem-solving skills
- Bilingual (English/Spanish) preferred
`,
    form: TerritoryManagerForm,
  },
  {
    title: "Territory Manager (Sales)",
    location: "Alabama / Louisiana",
    tags: ["Bilingual (English/Spanish)"],
    href: "territory-manager",
    description:
      "The Territory Manager is responsible for driving revenue growth, developing new restaurant accounts, and maintaining strong customer relationships within an assigned territory.",
    details: `
### Key Responsibilities:
- Prospect and acquire new restaurant and food service accounts
- Maintain consistent in-person customer visits
- Present weekly promotions and product opportunities
- Monitor competitor pricing and market activity
- Coordinate with operations regarding inventory and availability
- Maintain accurate CRM notes and sales reporting
- Meet or exceed monthly revenue and gross margin targets
### Qualifications:
- Prior food service or distribution sales experience preferred
- Strong negotiation and communication skills
- Self-motivated and goal-oriented
- Reliable transportation
- Bilingual (English/Spanish) preferred`,
    form: TerritoryManagerForm,
  },
  {
    title: "Operations Manager",
    location: "Alabama / Louisiana",
    tags: ["Bilingual (English/Spanish)"],
    href: "operations",
    description:
      "The Operations Manager oversees daily warehouse and distribution operations to ensure efficiency, food safety compliance, and on-time delivery execution.",
    details: `
### Key Responsibilities:
- Supervise warehouse associates and drivers
- Manage route planning and load accuracy
- Ensure cold-chain compliance and food safety standards
- Enforce FIFO inventory rotation
- Maintain sanitation and workplace safety standards
- Monitor labor productivity and operational efficiency
- Resolve operational issues quickly and effectively
- Ensure regulatory compliance across transportation and warehouse operations

- Qualifications:
- Experience in food distribution, logistics, or warehouse management
- Strong leadership and organizational skills
- Knowledge of DOT and transportation compliance preferred
- Detail-oriented with strong problem-solving ability`,
    form: TerritoryManagerForm,
  },
  {
    title: "Warehouse Associate",
    location: "Alabama / Louisiana",
    tags: [],
    href: "warehouse-associate",
    description:
      "Warehouse Associates are responsible for receiving, storing, selecting, and preparing product for daily distribution while maintaining food safety and warehouse standards.",
    details: `
### Key Responsibilities:
- Accurately pick, stage, and prepare customer orders
- Receive and inspect incoming product for quality
- Maintain organized storage areas (dry, refrigerated, frozen)
- Follow FIFO inventory rotation procedures
- Operate pallet jacks and warehouse equipment safely
- Maintain warehouse cleanliness and sanitation standards
- Assist with loading trucks for route delivery

### Qualifications:
- Ability to lift 50+ lbs
- Comfortable working in refrigerated environments
- Reliable and punctual
- Warehouse or distribution experience preferred`,
    form: TerritoryManagerForm,
  },
  {
    title: "Route Driver (Non-CDL)",
    location: "",
    tags: [],
    href: "route-driver-non-cdl",
    description:
      "The Non-CDL Route Driver is responsible for safe, accurate, and professional delivery of product to restaurant customers while maintaining compliance with applicable federal and state transportation regulations.",
    details: `
### Key Responsibilities:
- Deliver product according to assigned route schedule
- Verify invoices and obtain customer signatures
- Safely unload and handle product at delivery locations
- Complete daily pre-trip and post-trip inspections
- Maintain compliance with applicable DOT and FMCSA regulations when operating company vehicles
- Adhere to Hours of Service (HOS) requirements when applicable
- Report vehicle maintenance issues promptly
- Provide professional customer service at each stop

### Qualifications:
- Valid driver’s license
- Clean driving record (MVR review required)
- Must meet DOT physical requirements when applicable
- Ability to lift 50+ lbs
- Early morning route availability`,
    form: DriverForm,
  },
  {
    title: "Route Driver (CDL Class B)",
    location: "",
    tags: [],
    href: "route-driver-cdl",
    description:
      "The CDL Route Driver operates commercial motor vehicles to deliver product safely and efficiently while maintaining full DOT compliance.",
    details: `
### Key Responsibilities:
- Operate commercial box trucks in compliance with DOT regulations
- Complete daily pre-trip and post-trip inspections
- Maintain DOT logs and required documentation
- Comply with Hours of Service (HOS) regulations
- Ensure proper load securement and temperature control
- Deliver product accurately and on schedule
- Deliver product accurately and on schedule
- Maintain professional customer interaction

### Qualifications:
- Valid CDL Class B license
- Current DOT medical card
- Clean MVR
- Ability to perform physically demanding deliveries
- Knowledge of DOT and FMCSA regulations
      `,
    form: DriverForm,
  },
]
