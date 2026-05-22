import { createHash } from "node:crypto";
import bcrypt from "bcrypt";
import {
  AccountStatus,
  ActivityStatus,
  ActivityType,
  CandidateAvailability,
  CandidateStatus,
  ContactStatus,
  InterviewOutcome,
  LeadStatus,
  OpportunityStage,
  PlacementBillingStatus,
  Prisma,
  PrismaClient,
  ProposalApprovalStatus,
  ProposalStatus,
  RequirementPriority,
  RequirementStatus,
  RoleScope,
  SubmissionStatus,
  UserStatus,
  VendorDocumentStatus,
  VendorRiskStatus,
  VendorStatus,
  VendorTier,
  WorkMode,
} from "@prisma/client";
import type {
  Account,
  Candidate,
  Contact,
  Lead,
  Opportunity,
  Role,
  StaffAugRequirement,
  Tenant,
  User,
  Vendor,
} from "@prisma/client";

const prisma = new PrismaClient();

const developmentPassword = "Password123!";

const permissions = [
  {
    key: "leads:read:all",
    name: "Read leads",
    category: "leads",
    description: "View all tenant leads.",
  },
  {
    key: "leads:create",
    name: "Create leads",
    category: "leads",
    description: "Create tenant leads.",
  },
  {
    key: "leads:update:all",
    name: "Update leads",
    category: "leads",
    description: "Update all tenant leads.",
  },
  {
    key: "leads:delete:all",
    name: "Delete leads",
    category: "leads",
    description: "Soft delete tenant leads.",
  },
  {
    key: "opportunities:read:all",
    name: "Read opportunities",
    category: "opportunities",
    description: "View all tenant opportunities and pipeline views.",
  },
  {
    key: "opportunities:create",
    name: "Create opportunities",
    category: "opportunities",
    description: "Create tenant opportunities and convert leads.",
  },
  {
    key: "opportunities:update:all",
    name: "Update opportunities",
    category: "opportunities",
    description: "Update tenant opportunities and move pipeline stages.",
  },
  {
    key: "opportunities:delete:all",
    name: "Delete opportunities",
    category: "opportunities",
    description: "Soft delete tenant opportunities.",
  },
  {
    key: "proposals:read:all",
    name: "Read proposals",
    category: "proposals",
    description: "View all tenant proposals and approval queues.",
  },
  {
    key: "proposals:create",
    name: "Create proposals",
    category: "proposals",
    description: "Create tenant proposals and proposal versions.",
  },
  {
    key: "proposals:update:all",
    name: "Update proposals",
    category: "proposals",
    description: "Update all tenant proposals.",
  },
  {
    key: "proposals:delete:all",
    name: "Delete proposals",
    category: "proposals",
    description: "Soft delete tenant proposals.",
  },
  {
    key: "proposals:approve",
    name: "Approve proposals",
    category: "proposals",
    description: "Approve or reject submitted tenant proposals.",
  },
  {
    key: "activities:read:all",
    name: "Read activities",
    category: "activities",
    description: "View tenant activities, tasks, reminders, and timelines.",
  },
  {
    key: "activities:create",
    name: "Create activities",
    category: "activities",
    description: "Create tenant activities, tasks, and reminders.",
  },
  {
    key: "activities:update:all",
    name: "Update activities",
    category: "activities",
    description: "Update all tenant activities and task status.",
  },
  {
    key: "activities:delete:all",
    name: "Delete activities",
    category: "activities",
    description: "Soft delete tenant activities.",
  },
  {
    key: "vendors:read:all",
    name: "Read vendors",
    category: "vendors",
    description: "View all tenant vendors, documents, scorecards, and portal readiness.",
  },
  {
    key: "vendors:create",
    name: "Create vendors",
    category: "vendors",
    description: "Create tenant vendors.",
  },
  {
    key: "vendors:update:all",
    name: "Update vendors",
    category: "vendors",
    description: "Update all tenant vendors.",
  },
  {
    key: "vendors:delete:all",
    name: "Delete vendors",
    category: "vendors",
    description: "Soft delete tenant vendors.",
  },
  {
    key: "candidates:read:all",
    name: "Read candidates",
    category: "candidates",
    description: "View all tenant candidates, resumes, consent, and vendor links.",
  },
  {
    key: "candidates:create",
    name: "Create candidates",
    category: "candidates",
    description: "Create tenant candidates and queue resume parsing placeholders.",
  },
  {
    key: "candidates:update:all",
    name: "Update candidates",
    category: "candidates",
    description: "Update all tenant candidates, consent, skills, and blacklist status.",
  },
  {
    key: "candidates:delete:all",
    name: "Delete candidates",
    category: "candidates",
    description: "Soft delete tenant candidates.",
  },
  {
    key: "requirements:read:all",
    name: "Read requirements",
    category: "requirements",
    description: "View tenant staff augmentation requirements and submission trackers.",
  },
  {
    key: "requirements:create",
    name: "Create requirements",
    category: "requirements",
    description: "Create tenant staff augmentation requirements.",
  },
  {
    key: "requirements:update:all",
    name: "Update requirements",
    category: "requirements",
    description: "Update all tenant staff augmentation requirements.",
  },
  {
    key: "requirements:delete:all",
    name: "Delete requirements",
    category: "requirements",
    description: "Soft delete tenant staff augmentation requirements.",
  },
  {
    key: "submissions:read:all",
    name: "Read submissions",
    category: "submissions",
    description: "View candidate submissions and pipeline status.",
  },
  {
    key: "submissions:create",
    name: "Create submissions",
    category: "submissions",
    description: "Submit candidates to requirements.",
  },
  {
    key: "submissions:update:all",
    name: "Update submissions",
    category: "submissions",
    description: "Update submission review, client submission, interview, and feedback status.",
  },
  {
    key: "submissions:delete:all",
    name: "Delete submissions",
    category: "submissions",
    description: "Soft delete candidate submissions.",
  },
  {
    key: "interviews:read:all",
    name: "Read interviews",
    category: "interviews",
    description: "View tenant interview schedules, feedback, and outcomes.",
  },
  {
    key: "interviews:create",
    name: "Create interviews",
    category: "interviews",
    description: "Schedule tenant candidate interviews.",
  },
  {
    key: "interviews:update:all",
    name: "Update interviews",
    category: "interviews",
    description: "Update interview schedules, feedback, and outcomes.",
  },
  {
    key: "interviews:delete:all",
    name: "Delete interviews",
    category: "interviews",
    description: "Soft delete tenant interviews.",
  },
  {
    key: "placements:read:all",
    name: "Read placements",
    category: "placements",
    description: "View tenant placements, billing status, and authorized finance fields.",
  },
  {
    key: "placements:create",
    name: "Create placements",
    category: "placements",
    description: "Create selected candidate placements.",
  },
  {
    key: "placements:update:all",
    name: "Update placements",
    category: "placements",
    description: "Update placement billing, joining, replacement, and margin fields.",
  },
  {
    key: "placements:delete:all",
    name: "Delete placements",
    category: "placements",
    description: "Soft delete tenant placements.",
  },
  {
    key: "accounts:read:all",
    name: "Read accounts",
    category: "accounts",
    description: "View all tenant accounts.",
  },
  {
    key: "accounts:create",
    name: "Create accounts",
    category: "accounts",
    description: "Create tenant accounts.",
  },
  {
    key: "accounts:update:all",
    name: "Update accounts",
    category: "accounts",
    description: "Update all tenant accounts.",
  },
  {
    key: "accounts:delete:all",
    name: "Delete accounts",
    category: "accounts",
    description: "Soft delete tenant accounts.",
  },
  {
    key: "contacts:read:all",
    name: "Read contacts",
    category: "contacts",
    description: "View all tenant contacts.",
  },
  {
    key: "contacts:create",
    name: "Create contacts",
    category: "contacts",
    description: "Create tenant contacts.",
  },
  {
    key: "contacts:update:all",
    name: "Update contacts",
    category: "contacts",
    description: "Update all tenant contacts.",
  },
  {
    key: "contacts:delete:all",
    name: "Delete contacts",
    category: "contacts",
    description: "Soft delete tenant contacts.",
  },
  {
    key: "admin-settings:manage",
    name: "Manage admin settings",
    category: "admin",
    description: "Manage tenant security and company settings.",
  },
  {
    key: "ai-settings:manage",
    name: "Manage AI settings",
    category: "ai",
    description: "Configure AI providers, models, budgets, and encrypted API key storage.",
  },
  {
    key: "tenants:manage",
    name: "Manage tenants",
    category: "tenants",
    description: "Create and manage platform tenants.",
  },
  {
    key: "users:manage",
    name: "Manage users",
    category: "users",
    description: "Invite, update, deactivate, and restore users.",
  },
  {
    key: "roles:manage",
    name: "Manage roles",
    category: "roles",
    description: "Manage role and permission assignments.",
  },
  {
    key: "audit:read",
    name: "Read audit logs",
    category: "audit",
    description: "View audit history.",
  },
] as const;

async function upsertPermissions(): Promise<Map<string, string>> {
  const permissionIds = new Map<string, string>();

  for (const permission of permissions) {
    const savedPermission = await prisma.permission.upsert({
      where: { key: permission.key },
      create: permission,
      update: {
        name: permission.name,
        category: permission.category,
        description: permission.description,
        deletedAt: null,
      },
    });

    permissionIds.set(savedPermission.key, savedPermission.id);
  }

  return permissionIds;
}

async function assignPermissions(roleId: string, permissionIds: Iterable<string>): Promise<void> {
  for (const permissionId of permissionIds) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
      create: {
        roleId,
        permissionId,
      },
      update: {
        deletedAt: null,
      },
    });
  }
}

type PermissionKey = (typeof permissions)[number]["key"];

type TenantSeedTarget = {
  slug: string;
  name: string;
  leads: number;
  accounts: number;
  contacts: number;
  opportunities: number;
  proposals: number;
  vendors: number;
  candidates: number;
  requirements: number;
  submissions: number;
  interviews: number;
  placements: number;
};

type TenantSeedContext = {
  tenant: Tenant;
  users: User[];
  roles: Map<string, Role>;
};

type UserSeedSpec = {
  tenantSlug?: string;
  email: string;
  firstName: string;
  lastName: string;
  roleKey: string;
  isSuperAdmin?: boolean;
};

type BusinessSeedContext = {
  accounts: Account[];
  contacts: Contact[];
  leads: Lead[];
  opportunities: Opportunity[];
  vendors: Vendor[];
  candidates: Candidate[];
  requirements: StaffAugRequirement[];
};

const baseDate = new Date("2026-05-22T09:00:00.000Z");

const tenantTargets: readonly TenantSeedTarget[] = [
  {
    slug: "virtual-coders",
    name: "Virtual Coders",
    leads: 40,
    accounts: 10,
    contacts: 17,
    opportunities: 9,
    proposals: 4,
    vendors: 5,
    candidates: 40,
    requirements: 8,
    submissions: 20,
    interviews: 4,
    placements: 2,
  },
  {
    slug: "easenext",
    name: "Easenext",
    leads: 30,
    accounts: 10,
    contacts: 17,
    opportunities: 8,
    proposals: 3,
    vendors: 5,
    candidates: 30,
    requirements: 6,
    submissions: 15,
    interviews: 3,
    placements: 2,
  },
  {
    slug: "wurkzen",
    name: "Wurkzen",
    leads: 30,
    accounts: 10,
    contacts: 16,
    opportunities: 8,
    proposals: 3,
    vendors: 5,
    candidates: 30,
    requirements: 6,
    submissions: 15,
    interviews: 3,
    placements: 1,
  },
];

const roleSpecs: ReadonlyArray<{ key: string; name: string; description: string; permissions: readonly PermissionKey[] }> = [
  {
    key: "tenant-admin",
    name: "Tenant Admin",
    description: "Tenant administrator with full CRM and settings access.",
    permissions: permissions.map((permission) => permission.key),
  },
  {
    key: "founder",
    name: "Founder",
    description: "Founder view across sales, delivery, finance, and audit activity.",
    permissions: [
      "leads:read:all",
      "opportunities:read:all",
      "proposals:read:all",
      "activities:read:all",
      "vendors:read:all",
      "candidates:read:all",
      "requirements:read:all",
      "submissions:read:all",
      "interviews:read:all",
      "placements:read:all",
      "accounts:read:all",
      "contacts:read:all",
      "audit:read",
    ],
  },
  {
    key: "sales-manager",
    name: "Sales Manager",
    description: "Owns pipeline, proposals, accounts, contacts, and sales activity.",
    permissions: [
      "leads:read:all",
      "leads:create",
      "leads:update:all",
      "opportunities:read:all",
      "opportunities:create",
      "opportunities:update:all",
      "proposals:read:all",
      "proposals:create",
      "proposals:update:all",
      "proposals:approve",
      "activities:read:all",
      "activities:create",
      "activities:update:all",
      "accounts:read:all",
      "accounts:create",
      "accounts:update:all",
      "contacts:read:all",
      "contacts:create",
      "contacts:update:all",
    ],
  },
  {
    key: "sales-executive",
    name: "Sales Executive",
    description: "Works leads, opportunities, contacts, and daily follow-ups.",
    permissions: [
      "leads:read:all",
      "leads:create",
      "leads:update:all",
      "opportunities:read:all",
      "opportunities:create",
      "opportunities:update:all",
      "activities:read:all",
      "activities:create",
      "activities:update:all",
      "accounts:read:all",
      "contacts:read:all",
      "contacts:create",
    ],
  },
  {
    key: "delivery-manager",
    name: "Delivery Manager",
    description: "Manages requirements, submissions, interviews, placements, and vendors.",
    permissions: [
      "vendors:read:all",
      "vendors:create",
      "vendors:update:all",
      "candidates:read:all",
      "candidates:update:all",
      "requirements:read:all",
      "requirements:create",
      "requirements:update:all",
      "submissions:read:all",
      "submissions:create",
      "submissions:update:all",
      "interviews:read:all",
      "interviews:create",
      "interviews:update:all",
      "placements:read:all",
      "placements:create",
      "placements:update:all",
      "activities:read:all",
      "activities:create",
      "activities:update:all",
      "accounts:read:all",
    ],
  },
  {
    key: "hr-recruiter",
    name: "HR Recruiter",
    description: "Sources candidates and manages submissions and interview coordination.",
    permissions: [
      "vendors:read:all",
      "candidates:read:all",
      "candidates:create",
      "candidates:update:all",
      "requirements:read:all",
      "submissions:read:all",
      "submissions:create",
      "submissions:update:all",
      "interviews:read:all",
      "interviews:create",
      "interviews:update:all",
      "activities:read:all",
      "activities:create",
      "activities:update:all",
    ],
  },
  {
    key: "finance",
    name: "Finance",
    description: "Reviews placement revenue, billing status, and finance-sensitive reports.",
    permissions: [
      "placements:read:all",
      "placements:update:all",
      "vendors:read:all",
      "accounts:read:all",
      "opportunities:read:all",
      "proposals:read:all",
      "audit:read",
    ],
  },
  {
    key: "viewer",
    name: "Viewer",
    description: "Read-only CRM user for demos and stakeholder review.",
    permissions: [
      "leads:read:all",
      "opportunities:read:all",
      "proposals:read:all",
      "activities:read:all",
      "vendors:read:all",
      "candidates:read:all",
      "requirements:read:all",
      "submissions:read:all",
      "interviews:read:all",
      "placements:read:all",
      "accounts:read:all",
      "contacts:read:all",
    ],
  },
];

const userSpecs: readonly UserSeedSpec[] = [
  {
    email: "super.admin@virtualcoders.local",
    firstName: "Super",
    lastName: "Admin",
    roleKey: "super-admin",
    isSuperAdmin: true,
  },
  { tenantSlug: "virtual-coders", email: "tenant.admin@virtualcoders.local", firstName: "Ananya", lastName: "Shah", roleKey: "tenant-admin" },
  { tenantSlug: "virtual-coders", email: "founder@virtualcoders.local", firstName: "Rohan", lastName: "Mehta", roleKey: "founder" },
  { tenantSlug: "virtual-coders", email: "sales.manager@virtualcoders.local", firstName: "Kavya", lastName: "Iyer", roleKey: "sales-manager" },
  { tenantSlug: "virtual-coders", email: "sales.executive@virtualcoders.local", firstName: "Arjun", lastName: "Patel", roleKey: "sales-executive" },
  { tenantSlug: "virtual-coders", email: "delivery.manager@virtualcoders.local", firstName: "Neha", lastName: "Nair", roleKey: "delivery-manager" },
  { tenantSlug: "virtual-coders", email: "hr.recruiter@virtualcoders.local", firstName: "Pooja", lastName: "Desai", roleKey: "hr-recruiter" },
  { tenantSlug: "virtual-coders", email: "finance@virtualcoders.local", firstName: "Vikram", lastName: "Rao", roleKey: "finance" },
  { tenantSlug: "easenext", email: "tenant.admin@easenext.local", firstName: "Ishaan", lastName: "Kapoor", roleKey: "tenant-admin" },
  { tenantSlug: "easenext", email: "founder@easenext.local", firstName: "Meera", lastName: "Joshi", roleKey: "founder" },
  { tenantSlug: "easenext", email: "sales.manager@easenext.local", firstName: "Siddharth", lastName: "Kulkarni", roleKey: "sales-manager" },
  { tenantSlug: "easenext", email: "sales.executive@easenext.local", firstName: "Ritika", lastName: "Agarwal", roleKey: "sales-executive" },
  { tenantSlug: "easenext", email: "delivery.manager@easenext.local", firstName: "Nikhil", lastName: "Menon", roleKey: "delivery-manager" },
  { tenantSlug: "easenext", email: "hr.recruiter@easenext.local", firstName: "Sneha", lastName: "Bose", roleKey: "hr-recruiter" },
  { tenantSlug: "wurkzen", email: "tenant.admin@wurkzen.local", firstName: "Dev", lastName: "Trivedi", roleKey: "tenant-admin" },
  { tenantSlug: "wurkzen", email: "founder@wurkzen.local", firstName: "Priya", lastName: "Srinivasan", roleKey: "founder" },
  { tenantSlug: "wurkzen", email: "sales.manager@wurkzen.local", firstName: "Aarav", lastName: "Malhotra", roleKey: "sales-manager" },
  { tenantSlug: "wurkzen", email: "sales.executive@wurkzen.local", firstName: "Tanvi", lastName: "Bhat", roleKey: "sales-executive" },
  { tenantSlug: "wurkzen", email: "delivery.manager@wurkzen.local", firstName: "Kunal", lastName: "Saxena", roleKey: "delivery-manager" },
  { tenantSlug: "wurkzen", email: "hr.recruiter@wurkzen.local", firstName: "Aditi", lastName: "Reddy", roleKey: "hr-recruiter" },
];

const firstNames = [
  "Aarav",
  "Vivaan",
  "Aditya",
  "Arjun",
  "Sai",
  "Ishaan",
  "Kabir",
  "Rohan",
  "Anaya",
  "Diya",
  "Kiara",
  "Meera",
  "Nisha",
  "Priya",
  "Ritika",
  "Saanvi",
] as const;

const lastNames = [
  "Shah",
  "Patel",
  "Mehta",
  "Iyer",
  "Nair",
  "Rao",
  "Kapoor",
  "Joshi",
  "Menon",
  "Bose",
  "Trivedi",
  "Saxena",
  "Reddy",
  "Kulkarni",
  "Agarwal",
  "Desai",
] as const;

const indianCities = [
  { city: "Bengaluru", state: "Karnataka" },
  { city: "Pune", state: "Maharashtra" },
  { city: "Hyderabad", state: "Telangana" },
  { city: "Mumbai", state: "Maharashtra" },
  { city: "Gurugram", state: "Haryana" },
  { city: "Noida", state: "Uttar Pradesh" },
  { city: "Chennai", state: "Tamil Nadu" },
  { city: "Ahmedabad", state: "Gujarat" },
] as const;

const accountRoots = [
  "NexGen Retail",
  "Bharat Finserve",
  "CloudKart",
  "Aarogya Digital",
  "Metro Logistics",
  "EduBridge Labs",
  "UrbanFleet",
  "PaySetu",
  "GreenGrid Energy",
  "KisanTech",
  "Nova Insurance",
  "BluePeak SaaS",
] as const;

const serviceInterests = [
  "Dedicated React team",
  "Node.js API modernization",
  ".NET Azure squad",
  "QA automation pod",
  "DevOps managed services",
  "Salesforce implementation",
  "Data engineering team",
  "AI/ML prototype squad",
  "Flutter mobile team",
] as const;

const skills = [
  "React",
  "Node.js",
  "TypeScript",
  "Java",
  ".NET",
  "Python",
  "AWS",
  "Azure",
  "DevOps",
  "QA Automation",
  "Salesforce",
  "Data Engineering",
  "Flutter",
  "Business Analysis",
] as const;

const leadSources = ["Website", "LinkedIn", "Referral", "IndiaMART", "Webinar", "Outbound", "Partner", "Event"] as const;
const industries = ["Fintech", "Healthtech", "Retail", "Logistics", "Edtech", "SaaS", "Manufacturing", "Insurance"] as const;
const requirementRoles = ["React Developer", "Backend Engineer", "QA Automation Engineer", "DevOps Engineer", "Salesforce Developer", "Data Engineer", "Flutter Developer"] as const;
const vendorRoots = ["TalentBridge", "CodeNexus", "HireStack", "SkillForge", "PeopleGrid", "StaffOrbit", "TechBench"] as const;

function stableUuid(seed: string): string {
  const hex = createHash("sha256").update(seed).digest("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-8${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

function pick<T>(items: readonly T[], index: number): T {
  return items[index % items.length];
}

function daysFromBase(days: number, hourOffset = 0): Date {
  const date = new Date(baseDate);
  date.setUTCDate(date.getUTCDate() + days);
  date.setUTCHours(date.getUTCHours() + hourOffset);
  return date;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function amountCents(lakh: number): number {
  return Math.round(lakh * 100_000 * 100);
}

function probabilityForStage(stage: OpportunityStage): number {
  const probabilities: Record<OpportunityStage, number> = {
    [OpportunityStage.QUALIFICATION]: 10,
    [OpportunityStage.DISCOVERY]: 20,
    [OpportunityStage.REQUIREMENT]: 35,
    [OpportunityStage.PROPOSAL]: 50,
    [OpportunityStage.NEGOTIATION]: 65,
    [OpportunityStage.VERBAL_COMMIT]: 80,
    [OpportunityStage.CONTRACTING]: 90,
    [OpportunityStage.WON]: 100,
    [OpportunityStage.LOST]: 0,
  };

  return probabilities[stage];
}

function permissionIdsFor(keys: readonly PermissionKey[], permissionIds: Map<string, string>): string[] {
  return keys
    .map((key) => permissionIds.get(key))
    .filter((permissionId): permissionId is string => permissionId !== undefined);
}

async function seedTenants(): Promise<Map<string, Tenant>> {
  const tenants = new Map<string, Tenant>();

  for (const target of tenantTargets) {
    const tenant = await prisma.tenant.upsert({
      where: { slug: target.slug },
      create: {
        id: stableUuid(`tenant:${target.slug}`),
        name: target.name,
        slug: target.slug,
        timezone: "Asia/Kolkata",
        locale: "en-IN",
      },
      update: {
        name: target.name,
        timezone: "Asia/Kolkata",
        locale: "en-IN",
        deletedAt: null,
      },
    });

    await prisma.tenantSettings.upsert({
      where: { tenantId: tenant.id },
      create: {
        tenantId: tenant.id,
        companyName: tenant.name,
        timezone: tenant.timezone,
        locale: tenant.locale,
        sessionTimeoutMinutes: 480,
        passwordMinLength: 10,
        requireStrongPassword: true,
      },
      update: {
        companyName: tenant.name,
        timezone: tenant.timezone,
        locale: tenant.locale,
        sessionTimeoutMinutes: 480,
        passwordMinLength: 10,
        requireStrongPassword: true,
        deletedAt: null,
      },
    });

    for (const provider of ["openai", "anthropic", "gemini"] as const) {
      await prisma.aIProviderSetting.upsert({
        where: {
          tenantId_provider: {
            tenantId: tenant.id,
            provider,
          },
        },
        create: {
          tenantId: tenant.id,
          provider,
          defaultModel: provider === "openai" ? "gpt-4.1-mini" : "default",
          enabled: provider === "openai",
          monthlyBudgetCents: provider === "openai" ? amountCents(2) : 0,
          keyLastFour: provider === "openai" ? "demo" : null,
        },
        update: {
          defaultModel: provider === "openai" ? "gpt-4.1-mini" : "default",
          enabled: provider === "openai",
          monthlyBudgetCents: provider === "openai" ? amountCents(2) : 0,
          keyLastFour: provider === "openai" ? "demo" : null,
          deletedAt: null,
        },
      });
    }

    tenants.set(target.slug, tenant);
  }

  return tenants;
}

async function seedRoles(permissionIds: Map<string, string>, tenants: Map<string, Tenant>): Promise<Map<string, Role>> {
  const roles = new Map<string, Role>();
  const superAdminRole = await prisma.role.upsert({
    where: { uniqueKey: "global:super-admin" },
    create: {
      id: stableUuid("role:global:super-admin"),
      scope: RoleScope.GLOBAL,
      key: "super-admin",
      uniqueKey: "global:super-admin",
      name: "Super Admin",
      description: "Platform owner with global administration permissions.",
      isSystem: true,
    },
    update: {
      name: "Super Admin",
      description: "Platform owner with global administration permissions.",
      isSystem: true,
      deletedAt: null,
    },
  });

  await assignPermissions(superAdminRole.id, permissionIds.values());
  roles.set("global:super-admin", superAdminRole);

  for (const tenant of tenants.values()) {
    for (const spec of roleSpecs) {
      const role = await prisma.role.upsert({
        where: { uniqueKey: `${tenant.slug}:${spec.key}` },
        create: {
          id: stableUuid(`role:${tenant.slug}:${spec.key}`),
          tenantId: tenant.id,
          scope: RoleScope.TENANT,
          key: spec.key,
          uniqueKey: `${tenant.slug}:${spec.key}`,
          name: spec.name,
          description: spec.description,
          isSystem: true,
        },
        update: {
          tenantId: tenant.id,
          name: spec.name,
          description: spec.description,
          isSystem: true,
          deletedAt: null,
        },
      });

      await assignPermissions(role.id, permissionIdsFor(spec.permissions, permissionIds));
      roles.set(`${tenant.slug}:${spec.key}`, role);
    }
  }

  return roles;
}

async function seedUsers(
  passwordHash: string,
  tenants: Map<string, Tenant>,
  roles: Map<string, Role>,
): Promise<Map<string, TenantSeedContext>> {
  const contexts = new Map<string, TenantSeedContext>();

  for (const tenant of tenants.values()) {
    contexts.set(tenant.slug, {
      tenant,
      users: [],
      roles: new Map(
        roleSpecs
          .map((roleSpec): [string, Role] | undefined => {
            const role = roles.get(`${tenant.slug}:${roleSpec.key}`);
            return role ? [roleSpec.key, role] : undefined;
          })
          .filter((entry): entry is [string, Role] => entry !== undefined),
      ),
    });
  }

  for (const spec of userSpecs) {
    const tenant = spec.tenantSlug ? tenants.get(spec.tenantSlug) : undefined;
    const user = await prisma.user.upsert({
      where: { email: spec.email },
      create: {
        id: stableUuid(`user:${spec.email}`),
        tenantId: tenant?.id,
        email: spec.email,
        passwordHash,
        firstName: spec.firstName,
        lastName: spec.lastName,
        status: UserStatus.ACTIVE,
        isSuperAdmin: spec.isSuperAdmin ?? false,
        lastLoginAt: daysFromBase(-(spec.email.length % 14)),
      },
      update: {
        tenantId: tenant?.id,
        passwordHash,
        firstName: spec.firstName,
        lastName: spec.lastName,
        status: UserStatus.ACTIVE,
        isSuperAdmin: spec.isSuperAdmin ?? false,
        lastLoginAt: daysFromBase(-(spec.email.length % 14)),
        deletedAt: null,
      },
    });

    const role = roles.get(spec.tenantSlug ? `${spec.tenantSlug}:${spec.roleKey}` : `global:${spec.roleKey}`);
    if (role) {
      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: user.id,
            roleId: role.id,
          },
        },
        create: {
          userId: user.id,
          roleId: role.id,
        },
        update: {
          deletedAt: null,
        },
      });
    }

    if (spec.tenantSlug) {
      contexts.get(spec.tenantSlug)?.users.push(user);
    }
  }

  return contexts;
}

async function seedAccounts(context: TenantSeedContext, target: TenantSeedTarget): Promise<Account[]> {
  const accounts: Account[] = [];

  for (let index = 0; index < target.accounts; index += 1) {
    const city = pick(indianCities, index);
    const rootName = pick(accountRoots, index + target.slug.length);
    const name = `${rootName} ${index + 1}`;
    const owner = pick(context.users, index + 2);
    const domain = `${slugify(name)}.in`;
    const account = await prisma.account.upsert({
      where: { id: stableUuid(`${target.slug}:account:${index}`) },
      create: {
        id: stableUuid(`${target.slug}:account:${index}`),
        tenantId: context.tenant.id,
        name,
        website: `https://${domain}`,
        domain,
        industry: pick(industries, index),
        phone: `+91 80${String(41000000 + index * 137).slice(-8)}`,
        city: city.city,
        country: "India",
        status: index % 5 === 0 ? AccountStatus.PROSPECT : AccountStatus.ACTIVE,
        ownerId: owner.id,
        notes: `Indian ${pick(industries, index).toLowerCase()} account exploring IT services and staff augmentation.`,
        createdById: owner.id,
      },
      update: {
        name,
        website: `https://${domain}`,
        domain,
        industry: pick(industries, index),
        phone: `+91 80${String(41000000 + index * 137).slice(-8)}`,
        city: city.city,
        country: "India",
        status: index % 5 === 0 ? AccountStatus.PROSPECT : AccountStatus.ACTIVE,
        ownerId: owner.id,
        notes: `Indian ${pick(industries, index).toLowerCase()} account exploring IT services and staff augmentation.`,
        updatedById: owner.id,
        deletedAt: null,
      },
    });

    accounts.push(account);
  }

  return accounts;
}

async function seedContacts(context: TenantSeedContext, target: TenantSeedTarget, accounts: Account[]): Promise<Contact[]> {
  const contacts: Contact[] = [];

  for (let index = 0; index < target.contacts; index += 1) {
    const account = pick(accounts, index);
    const firstName = pick(firstNames, index + 3);
    const lastName = pick(lastNames, index + 5);
    const owner = pick(context.users, index + 1);
    const emailDomain = account.domain ?? `${slugify(account.name)}.in`;
    const contact = await prisma.contact.upsert({
      where: { id: stableUuid(`${target.slug}:contact:${index}`) },
      create: {
        id: stableUuid(`${target.slug}:contact:${index}`),
        tenantId: context.tenant.id,
        accountId: account.id,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${emailDomain}`,
        phone: `+91 98${String(70000000 + index * 241).slice(-8)}`,
        title: index % 3 === 0 ? "CTO" : index % 3 === 1 ? "VP Engineering" : "Talent Acquisition Lead",
        linkedinUrl: `https://linkedin.com/in/${slugify(`${firstName}-${lastName}-${target.slug}-${index}`)}`,
        decisionMaker: index % 3 !== 2,
        influenceLevel: index % 3 === 0 ? "High" : "Medium",
        status: ContactStatus.ACTIVE,
        ownerId: owner.id,
        notes: "Key stakeholder for IT services and staff augmentation discussions.",
        createdById: owner.id,
      },
      update: {
        accountId: account.id,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${emailDomain}`,
        phone: `+91 98${String(70000000 + index * 241).slice(-8)}`,
        title: index % 3 === 0 ? "CTO" : index % 3 === 1 ? "VP Engineering" : "Talent Acquisition Lead",
        linkedinUrl: `https://linkedin.com/in/${slugify(`${firstName}-${lastName}-${target.slug}-${index}`)}`,
        decisionMaker: index % 3 !== 2,
        influenceLevel: index % 3 === 0 ? "High" : "Medium",
        status: ContactStatus.ACTIVE,
        ownerId: owner.id,
        notes: "Key stakeholder for IT services and staff augmentation discussions.",
        updatedById: owner.id,
        deletedAt: null,
      },
    });

    contacts.push(contact);
  }

  return contacts;
}

async function seedLeads(context: TenantSeedContext, target: TenantSeedTarget): Promise<Lead[]> {
  const leads: Lead[] = [];
  const leadStatuses = [
    LeadStatus.NEW,
    LeadStatus.CONTACTED,
    LeadStatus.QUALIFIED,
    LeadStatus.NURTURING,
    LeadStatus.CONVERTED,
    LeadStatus.LOST,
  ] as const;

  for (let index = 0; index < target.leads; index += 1) {
    const firstName = pick(firstNames, index);
    const lastName = pick(lastNames, index + 2);
    const company = `${pick(accountRoots, index + 4)} Lead ${index + 1}`;
    const domain = `${slugify(company)}.co.in`;
    const owner = pick(context.users, index + 3);
    const status = pick(leadStatuses, index);
    const lead = await prisma.lead.upsert({
      where: { id: stableUuid(`${target.slug}:lead:${index}`) },
      create: {
        id: stableUuid(`${target.slug}:lead:${index}`),
        tenantId: context.tenant.id,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@${domain}`,
        phone: `+91 99${String(10000000 + index * 173).slice(-8)}`,
        company,
        website: `https://${domain}`,
        companyDomain: domain,
        linkedinUrl: `https://linkedin.com/in/${slugify(`${firstName}-${lastName}-${target.slug}-lead-${index}`)}`,
        country: "India",
        source: pick(leadSources, index),
        serviceInterest: pick(serviceInterests, index),
        budgetRange: index % 4 === 0 ? "₹10L-₹25L" : index % 4 === 1 ? "₹25L-₹50L" : index % 4 === 2 ? "₹50L-₹1Cr" : "₹1Cr+",
        status,
        score: 42 + ((index * 7) % 56),
        scoreReason: "Seeded score based on source fit, service interest, and follow-up recency.",
        ownerId: owner.id,
        followUpAt: status === LeadStatus.CONVERTED || status === LeadStatus.LOST ? null : daysFromBase((index % 12) - 3),
        lostReason: status === LeadStatus.LOST ? "Budget not aligned for current quarter" : null,
        importBatchId: `seed-${target.slug}-leads`,
        importExternalId: `${target.slug}-lead-${index}`,
        importSourceFilename: "dummy-leads.csv",
        notes: `Interested in ${pick(serviceInterests, index).toLowerCase()} for a growing Indian IT team.`,
        createdById: owner.id,
      },
      update: {
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@${domain}`,
        phone: `+91 99${String(10000000 + index * 173).slice(-8)}`,
        company,
        website: `https://${domain}`,
        companyDomain: domain,
        linkedinUrl: `https://linkedin.com/in/${slugify(`${firstName}-${lastName}-${target.slug}-lead-${index}`)}`,
        country: "India",
        source: pick(leadSources, index),
        serviceInterest: pick(serviceInterests, index),
        budgetRange: index % 4 === 0 ? "₹10L-₹25L" : index % 4 === 1 ? "₹25L-₹50L" : index % 4 === 2 ? "₹50L-₹1Cr" : "₹1Cr+",
        status,
        score: 42 + ((index * 7) % 56),
        scoreReason: "Seeded score based on source fit, service interest, and follow-up recency.",
        ownerId: owner.id,
        followUpAt: status === LeadStatus.CONVERTED || status === LeadStatus.LOST ? null : daysFromBase((index % 12) - 3),
        lostReason: status === LeadStatus.LOST ? "Budget not aligned for current quarter" : null,
        importBatchId: `seed-${target.slug}-leads`,
        importExternalId: `${target.slug}-lead-${index}`,
        importSourceFilename: "dummy-leads.csv",
        notes: `Interested in ${pick(serviceInterests, index).toLowerCase()} for a growing Indian IT team.`,
        updatedById: owner.id,
        deletedAt: null,
      },
    });

    leads.push(lead);
  }

  return leads;
}

async function seedOpportunities(
  context: TenantSeedContext,
  target: TenantSeedTarget,
  accounts: Account[],
  contacts: Contact[],
  leads: Lead[],
): Promise<Opportunity[]> {
  const opportunities: Opportunity[] = [];
  const stages = [
    OpportunityStage.QUALIFICATION,
    OpportunityStage.DISCOVERY,
    OpportunityStage.REQUIREMENT,
    OpportunityStage.PROPOSAL,
    OpportunityStage.NEGOTIATION,
    OpportunityStage.VERBAL_COMMIT,
    OpportunityStage.CONTRACTING,
    OpportunityStage.WON,
    OpportunityStage.LOST,
  ] as const;

  for (let index = 0; index < target.opportunities; index += 1) {
    const account = pick(accounts, index);
    const contact = pick(contacts, index + 1);
    const lead = pick(leads, index + 2);
    const stage = pick(stages, index);
    const probability = probabilityForStage(stage);
    const valueCents = amountCents(18 + index * 4 + target.slug.length);
    const owner = pick(context.users, index + 2);
    const name = `${account.name} - ${pick(serviceInterests, index)}`;
    const opportunity = await prisma.opportunity.upsert({
      where: { id: stableUuid(`${target.slug}:opportunity:${index}`) },
      create: {
        id: stableUuid(`${target.slug}:opportunity:${index}`),
        tenantId: context.tenant.id,
        accountId: account.id,
        primaryContactId: contact.id,
        leadId: lead.id,
        name,
        stage,
        probability,
        valueCents,
        currency: "INR",
        expectedCloseDate: daysFromBase(20 + index * 5),
        weightedForecastCents: Math.round((valueCents * probability) / 100),
        ownerId: owner.id,
        stageChangedAt: daysFromBase(-index),
        wonAt: stage === OpportunityStage.WON ? daysFromBase(-2) : null,
        lostAt: stage === OpportunityStage.LOST ? daysFromBase(-4) : null,
        lostReason: stage === OpportunityStage.LOST ? "Client paused hiring plan" : null,
        notes: "Seeded opportunity for recurring IT services and staff augmentation pipeline.",
        createdById: owner.id,
      },
      update: {
        accountId: account.id,
        primaryContactId: contact.id,
        leadId: lead.id,
        name,
        stage,
        probability,
        valueCents,
        currency: "INR",
        expectedCloseDate: daysFromBase(20 + index * 5),
        weightedForecastCents: Math.round((valueCents * probability) / 100),
        ownerId: owner.id,
        stageChangedAt: daysFromBase(-index),
        wonAt: stage === OpportunityStage.WON ? daysFromBase(-2) : null,
        lostAt: stage === OpportunityStage.LOST ? daysFromBase(-4) : null,
        lostReason: stage === OpportunityStage.LOST ? "Client paused hiring plan" : null,
        notes: "Seeded opportunity for recurring IT services and staff augmentation pipeline.",
        updatedById: owner.id,
        deletedAt: null,
      },
    });

    await prisma.opportunityStageHistory.upsert({
      where: { id: stableUuid(`${target.slug}:opportunity-stage:${index}`) },
      create: {
        id: stableUuid(`${target.slug}:opportunity-stage:${index}`),
        tenantId: context.tenant.id,
        opportunityId: opportunity.id,
        fromStage: index % 2 === 0 ? OpportunityStage.DISCOVERY : OpportunityStage.QUALIFICATION,
        toStage: stage,
        changedAt: daysFromBase(-index),
        changedById: owner.id,
        note: `Moved to ${stage.toLowerCase().replace(/_/g, " ")} during seed setup.`,
      },
      update: {
        fromStage: index % 2 === 0 ? OpportunityStage.DISCOVERY : OpportunityStage.QUALIFICATION,
        toStage: stage,
        changedAt: daysFromBase(-index),
        changedById: owner.id,
        note: `Moved to ${stage.toLowerCase().replace(/_/g, " ")} during seed setup.`,
        deletedAt: null,
      },
    });

    opportunities.push(opportunity);
  }

  return opportunities;
}

async function seedProposals(
  context: TenantSeedContext,
  target: TenantSeedTarget,
  accounts: Account[],
  contacts: Contact[],
  opportunities: Opportunity[],
): Promise<void> {
  const statuses = [ProposalStatus.DRAFT, ProposalStatus.SUBMITTED, ProposalStatus.APPROVED, ProposalStatus.SENT, ProposalStatus.WON] as const;

  for (let index = 0; index < target.proposals; index += 1) {
    const opportunity = pick(opportunities, index);
    const account = pick(accounts, index);
    const contact = pick(contacts, index);
    const owner = pick(context.users, index + 1);
    const status = pick(statuses, index);
    const proposal = await prisma.proposal.upsert({
      where: { id: stableUuid(`${target.slug}:proposal:${index}`) },
      create: {
        id: stableUuid(`${target.slug}:proposal:${index}`),
        tenantId: context.tenant.id,
        opportunityId: opportunity.id,
        accountId: account.id,
        contactId: contact.id,
        title: `${account.name} Staff Augmentation Proposal`,
        templateKey: "staff-augmentation-sow",
        status,
        currentVersionNumber: 1,
        approvalRole: "sales-manager",
        ownerId: owner.id,
        valueCents: opportunity.valueCents,
        currency: "INR",
        submittedAt: status === ProposalStatus.SUBMITTED || status === ProposalStatus.APPROVED || status === ProposalStatus.SENT || status === ProposalStatus.WON ? daysFromBase(-8 + index) : null,
        approvedAt: status === ProposalStatus.APPROVED || status === ProposalStatus.SENT || status === ProposalStatus.WON ? daysFromBase(-5 + index) : null,
        sentAt: status === ProposalStatus.SENT || status === ProposalStatus.WON ? daysFromBase(-3 + index) : null,
        wonAt: status === ProposalStatus.WON ? daysFromBase(-1) : null,
        notes: "Seeded proposal with realistic India delivery assumptions and commercial terms.",
        createdById: owner.id,
      },
      update: {
        opportunityId: opportunity.id,
        accountId: account.id,
        contactId: contact.id,
        title: `${account.name} Staff Augmentation Proposal`,
        templateKey: "staff-augmentation-sow",
        status,
        currentVersionNumber: 1,
        approvalRole: "sales-manager",
        ownerId: owner.id,
        valueCents: opportunity.valueCents,
        currency: "INR",
        submittedAt: status === ProposalStatus.SUBMITTED || status === ProposalStatus.APPROVED || status === ProposalStatus.SENT || status === ProposalStatus.WON ? daysFromBase(-8 + index) : null,
        approvedAt: status === ProposalStatus.APPROVED || status === ProposalStatus.SENT || status === ProposalStatus.WON ? daysFromBase(-5 + index) : null,
        sentAt: status === ProposalStatus.SENT || status === ProposalStatus.WON ? daysFromBase(-3 + index) : null,
        wonAt: status === ProposalStatus.WON ? daysFromBase(-1) : null,
        notes: "Seeded proposal with realistic India delivery assumptions and commercial terms.",
        updatedById: owner.id,
        deletedAt: null,
      },
    });

    await prisma.proposalVersion.upsert({
      where: {
        proposalId_versionNumber: {
          proposalId: proposal.id,
          versionNumber: 1,
        },
      },
      create: {
        id: stableUuid(`${target.slug}:proposal-version:${index}:1`),
        tenantId: context.tenant.id,
        proposalId: proposal.id,
        versionNumber: 1,
        templateKey: "staff-augmentation-sow",
        title: proposal.title,
        contentJson: {
          executiveSummary: "Dedicated India-based engineering team with milestone governance.",
          scope: ["Discovery", "Dedicated squad onboarding", "Monthly delivery reporting"],
          commercialModel: "Monthly T&M in INR",
        } satisfies Prisma.InputJsonValue,
        changeNote: "Initial seeded proposal version.",
        createdById: owner.id,
      },
      update: {
        templateKey: "staff-augmentation-sow",
        title: proposal.title,
        contentJson: {
          executiveSummary: "Dedicated India-based engineering team with milestone governance.",
          scope: ["Discovery", "Dedicated squad onboarding", "Monthly delivery reporting"],
          commercialModel: "Monthly T&M in INR",
        } satisfies Prisma.InputJsonValue,
        changeNote: "Initial seeded proposal version.",
        updatedById: owner.id,
        deletedAt: null,
      },
    });

    await prisma.proposalApproval.upsert({
      where: { id: stableUuid(`${target.slug}:proposal-approval:${index}`) },
      create: {
        id: stableUuid(`${target.slug}:proposal-approval:${index}`),
        tenantId: context.tenant.id,
        proposalId: proposal.id,
        roleKey: "sales-manager",
        status: status === ProposalStatus.DRAFT ? ProposalApprovalStatus.PENDING : ProposalApprovalStatus.APPROVED,
        approverUserId: owner.id,
        decidedAt: status === ProposalStatus.DRAFT ? null : daysFromBase(-4 + index),
        comment: status === ProposalStatus.DRAFT ? "Awaiting final pricing confirmation." : "Approved for client submission.",
        createdById: owner.id,
      },
      update: {
        roleKey: "sales-manager",
        status: status === ProposalStatus.DRAFT ? ProposalApprovalStatus.PENDING : ProposalApprovalStatus.APPROVED,
        approverUserId: owner.id,
        decidedAt: status === ProposalStatus.DRAFT ? null : daysFromBase(-4 + index),
        comment: status === ProposalStatus.DRAFT ? "Awaiting final pricing confirmation." : "Approved for client submission.",
        updatedById: owner.id,
        deletedAt: null,
      },
    });
  }
}

async function seedVendors(context: TenantSeedContext, target: TenantSeedTarget): Promise<Vendor[]> {
  const vendors: Vendor[] = [];

  for (let index = 0; index < target.vendors; index += 1) {
    const city = pick(indianCities, index + 2);
    const name = `${pick(vendorRoots, index)} ${city.city} Partners`;
    const slug = `${target.slug}-${slugify(name)}`;
    const vendor = await prisma.vendor.upsert({
      where: { id: stableUuid(`${target.slug}:vendor:${index}`) },
      create: {
        id: stableUuid(`${target.slug}:vendor:${index}`),
        tenantId: context.tenant.id,
        name,
        website: `https://${slug}.in`,
        domain: `${slug}.in`,
        email: `alliances@${slug}.in`,
        phone: `+91 79${String(50000000 + index * 353).slice(-8)}`,
        categories: index % 2 === 0 ? ["Staff Augmentation", "Contract Hiring"] : ["Specialist Hiring", "Payroll Support"],
        expertiseSkills: [pick(skills, index), pick(skills, index + 3), pick(skills, index + 6)],
        decisionMakerName: `${pick(firstNames, index + 4)} ${pick(lastNames, index + 7)}`,
        decisionMakerTitle: "Director - Client Partnerships",
        decisionMakerEmail: `partner.${index}@${slug}.in`,
        decisionMakerPhone: `+91 97${String(30000000 + index * 379).slice(-8)}`,
        city: city.city,
        state: city.state,
        country: "India",
        timezone: "Asia/Kolkata",
        companyOwnershipTag: index % 2 === 0 ? "vendor-partner" : "staffing-specialist",
        ndaStatus: VendorDocumentStatus.SIGNED,
        msaStatus: index % 3 === 0 ? VendorDocumentStatus.IN_REVIEW : VendorDocumentStatus.SIGNED,
        rateCard: {
          currency: "INR",
          monthlyRates: {
            junior: 110000 + index * 5000,
            mid: 180000 + index * 7000,
            senior: 280000 + index * 9000,
          },
        } satisfies Prisma.InputJsonValue,
        tier: index % 4 === 0 ? VendorTier.STRATEGIC : index % 4 === 1 ? VendorTier.PREFERRED : VendorTier.STANDARD,
        status: index % 5 === 0 ? VendorStatus.ONBOARDING : VendorStatus.ACTIVE,
        riskStatus: index % 7 === 0 ? VendorRiskStatus.WARNING : VendorRiskStatus.CLEAR,
        riskReason: index % 7 === 0 ? "Pending updated MSA annexure" : null,
        deliveryScore: 72 + ((index * 5) % 24),
        qualityScore: 74 + ((index * 4) % 22),
        responsivenessScore: 70 + ((index * 6) % 24),
        complianceScore: 76 + ((index * 3) % 20),
        overallScore: 73 + ((index * 5) % 23),
        portalEnabled: index % 2 === 0,
        portalSlug: slug,
        portalInviteEmail: `portal@${slug}.in`,
        portalLastLoginAt: index % 2 === 0 ? daysFromBase(-index) : null,
        notes: "Seeded vendor partner for Indian IT staff augmentation delivery.",
      },
      update: {
        name,
        website: `https://${slug}.in`,
        domain: `${slug}.in`,
        email: `alliances@${slug}.in`,
        phone: `+91 79${String(50000000 + index * 353).slice(-8)}`,
        categories: index % 2 === 0 ? ["Staff Augmentation", "Contract Hiring"] : ["Specialist Hiring", "Payroll Support"],
        expertiseSkills: [pick(skills, index), pick(skills, index + 3), pick(skills, index + 6)],
        decisionMakerName: `${pick(firstNames, index + 4)} ${pick(lastNames, index + 7)}`,
        decisionMakerTitle: "Director - Client Partnerships",
        decisionMakerEmail: `partner.${index}@${slug}.in`,
        decisionMakerPhone: `+91 97${String(30000000 + index * 379).slice(-8)}`,
        city: city.city,
        state: city.state,
        country: "India",
        timezone: "Asia/Kolkata",
        companyOwnershipTag: index % 2 === 0 ? "vendor-partner" : "staffing-specialist",
        ndaStatus: VendorDocumentStatus.SIGNED,
        msaStatus: index % 3 === 0 ? VendorDocumentStatus.IN_REVIEW : VendorDocumentStatus.SIGNED,
        rateCard: {
          currency: "INR",
          monthlyRates: {
            junior: 110000 + index * 5000,
            mid: 180000 + index * 7000,
            senior: 280000 + index * 9000,
          },
        } satisfies Prisma.InputJsonValue,
        tier: index % 4 === 0 ? VendorTier.STRATEGIC : index % 4 === 1 ? VendorTier.PREFERRED : VendorTier.STANDARD,
        status: index % 5 === 0 ? VendorStatus.ONBOARDING : VendorStatus.ACTIVE,
        riskStatus: index % 7 === 0 ? VendorRiskStatus.WARNING : VendorRiskStatus.CLEAR,
        riskReason: index % 7 === 0 ? "Pending updated MSA annexure" : null,
        deliveryScore: 72 + ((index * 5) % 24),
        qualityScore: 74 + ((index * 4) % 22),
        responsivenessScore: 70 + ((index * 6) % 24),
        complianceScore: 76 + ((index * 3) % 20),
        overallScore: 73 + ((index * 5) % 23),
        portalEnabled: index % 2 === 0,
        portalSlug: slug,
        portalInviteEmail: `portal@${slug}.in`,
        portalLastLoginAt: index % 2 === 0 ? daysFromBase(-index) : null,
        notes: "Seeded vendor partner for Indian IT staff augmentation delivery.",
        deletedAt: null,
      },
    });

    vendors.push(vendor);
  }

  return vendors;
}

async function seedCandidates(context: TenantSeedContext, target: TenantSeedTarget, vendors: Vendor[]): Promise<Candidate[]> {
  const candidates: Candidate[] = [];

  for (let index = 0; index < target.candidates; index += 1) {
    const city = pick(indianCities, index + 1);
    const firstName = pick(firstNames, index + 5);
    const lastName = pick(lastNames, index + 9);
    const vendor = index % 4 === 0 ? null : pick(vendors, index);
    const experienceYears = 2 + ((index * 0.5) % 10);
    const candidate = await prisma.candidate.upsert({
      where: { id: stableUuid(`${target.slug}:candidate:${index}`) },
      create: {
        id: stableUuid(`${target.slug}:candidate:${index}`),
        tenantId: context.tenant.id,
        vendorId: vendor?.id,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@talentmail.in`,
        phone: `+91 96${String(20000000 + index * 211).slice(-8)}`,
        resumeFileName: `${slugify(`${firstName}-${lastName}`)}-resume.pdf`,
        resumeStorageKey: `seed/resumes/${target.slug}/${index}.pdf`,
        resumeMimeType: "application/pdf",
        resumeSizeBytes: 180000 + index * 1200,
        resumeUploadedAt: daysFromBase(-20 + (index % 14)),
        primarySkills: [pick(skills, index), pick(skills, index + 2), pick(skills, index + 5)],
        secondarySkills: [pick(skills, index + 7), pick(skills, index + 9)],
        experienceYears,
        currentCtcCents: amountCents(8 + experienceYears * 1.2),
        expectedCtcCents: amountCents(11 + experienceYears * 1.5),
        currency: "INR",
        noticePeriodDays: index % 5 === 0 ? 0 : index % 5 === 1 ? 15 : index % 5 === 2 ? 30 : 60,
        city: city.city,
        state: city.state,
        country: "India",
        timezone: "Asia/Kolkata",
        availability: index % 5 === 0 ? CandidateAvailability.IMMEDIATE : index % 5 === 4 ? CandidateAvailability.NOT_AVAILABLE : CandidateAvailability.NOTICE_PERIOD,
        availableFrom: index % 5 === 0 ? daysFromBase(1) : daysFromBase(15 + (index % 45)),
        consentStatus: index % 6 !== 0,
        consentCapturedAt: index % 6 !== 0 ? daysFromBase(-index % 30) : null,
        consentSource: index % 6 !== 0 ? "Email consent" : null,
        blacklisted: false,
        status: index % 13 === 0 ? CandidateStatus.PLACED : CandidateStatus.ACTIVE,
        resumeParsed: index % 3 !== 0,
        resumeParseStatus: index % 3 !== 0 ? "APPROVED" : "PENDING",
        parsedResumeJson: {
          headline: `${pick(requirementRoles, index)} with ${experienceYears.toFixed(1)} years experience`,
          skills: [pick(skills, index), pick(skills, index + 2), pick(skills, index + 5)],
        } satisfies Prisma.InputJsonValue,
        notes: "Seeded Indian IT candidate profile with staff augmentation readiness.",
      },
      update: {
        vendorId: vendor?.id,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@talentmail.in`,
        phone: `+91 96${String(20000000 + index * 211).slice(-8)}`,
        resumeFileName: `${slugify(`${firstName}-${lastName}`)}-resume.pdf`,
        resumeStorageKey: `seed/resumes/${target.slug}/${index}.pdf`,
        resumeMimeType: "application/pdf",
        resumeSizeBytes: 180000 + index * 1200,
        resumeUploadedAt: daysFromBase(-20 + (index % 14)),
        primarySkills: [pick(skills, index), pick(skills, index + 2), pick(skills, index + 5)],
        secondarySkills: [pick(skills, index + 7), pick(skills, index + 9)],
        experienceYears,
        currentCtcCents: amountCents(8 + experienceYears * 1.2),
        expectedCtcCents: amountCents(11 + experienceYears * 1.5),
        currency: "INR",
        noticePeriodDays: index % 5 === 0 ? 0 : index % 5 === 1 ? 15 : index % 5 === 2 ? 30 : 60,
        city: city.city,
        state: city.state,
        country: "India",
        timezone: "Asia/Kolkata",
        availability: index % 5 === 0 ? CandidateAvailability.IMMEDIATE : index % 5 === 4 ? CandidateAvailability.NOT_AVAILABLE : CandidateAvailability.NOTICE_PERIOD,
        availableFrom: index % 5 === 0 ? daysFromBase(1) : daysFromBase(15 + (index % 45)),
        consentStatus: index % 6 !== 0,
        consentCapturedAt: index % 6 !== 0 ? daysFromBase(-index % 30) : null,
        consentSource: index % 6 !== 0 ? "Email consent" : null,
        blacklisted: false,
        status: index % 13 === 0 ? CandidateStatus.PLACED : CandidateStatus.ACTIVE,
        resumeParsed: index % 3 !== 0,
        resumeParseStatus: index % 3 !== 0 ? "APPROVED" : "PENDING",
        parsedResumeJson: {
          headline: `${pick(requirementRoles, index)} with ${experienceYears.toFixed(1)} years experience`,
          skills: [pick(skills, index), pick(skills, index + 2), pick(skills, index + 5)],
        } satisfies Prisma.InputJsonValue,
        notes: "Seeded Indian IT candidate profile with staff augmentation readiness.",
        deletedAt: null,
      },
    });

    candidates.push(candidate);
  }

  return candidates;
}

async function seedRequirements(
  context: TenantSeedContext,
  target: TenantSeedTarget,
  accounts: Account[],
  opportunities: Opportunity[],
): Promise<StaffAugRequirement[]> {
  const requirements: StaffAugRequirement[] = [];

  for (let index = 0; index < target.requirements; index += 1) {
    const account = pick(accounts, index);
    const opportunity = pick(opportunities, index);
    const roleTitle = pick(requirementRoles, index);
    const requirement = await prisma.staffAugRequirement.upsert({
      where: { id: stableUuid(`${target.slug}:requirement:${index}`) },
      create: {
        id: stableUuid(`${target.slug}:requirement:${index}`),
        tenantId: context.tenant.id,
        accountId: account.id,
        opportunityId: opportunity.id,
        roleTitle,
        skills: [pick(skills, index), pick(skills, index + 2), pick(skills, index + 4)],
        minExperienceYears: 2 + (index % 4),
        maxExperienceYears: 6 + (index % 6),
        budgetMinCents: amountCents(1.4 + index * 0.1),
        budgetMaxCents: amountCents(2.8 + index * 0.16),
        currency: "INR",
        location: pick(indianCities, index).city,
        workMode: index % 3 === 0 ? WorkMode.REMOTE : index % 3 === 1 ? WorkMode.HYBRID : WorkMode.ONSITE,
        positions: 1 + (index % 4),
        priority: index % 5 === 0 ? RequirementPriority.URGENT : index % 3 === 0 ? RequirementPriority.HIGH : RequirementPriority.MEDIUM,
        status: index % 7 === 0 ? RequirementStatus.FILLED : index % 6 === 0 ? RequirementStatus.ON_HOLD : RequirementStatus.OPEN,
        notes: "Seeded staff augmentation requirement with vendor broadcast and submission funnel context.",
        createdById: pick(context.users, index).id,
      },
      update: {
        accountId: account.id,
        opportunityId: opportunity.id,
        roleTitle,
        skills: [pick(skills, index), pick(skills, index + 2), pick(skills, index + 4)],
        minExperienceYears: 2 + (index % 4),
        maxExperienceYears: 6 + (index % 6),
        budgetMinCents: amountCents(1.4 + index * 0.1),
        budgetMaxCents: amountCents(2.8 + index * 0.16),
        currency: "INR",
        location: pick(indianCities, index).city,
        workMode: index % 3 === 0 ? WorkMode.REMOTE : index % 3 === 1 ? WorkMode.HYBRID : WorkMode.ONSITE,
        positions: 1 + (index % 4),
        priority: index % 5 === 0 ? RequirementPriority.URGENT : index % 3 === 0 ? RequirementPriority.HIGH : RequirementPriority.MEDIUM,
        status: index % 7 === 0 ? RequirementStatus.FILLED : index % 6 === 0 ? RequirementStatus.ON_HOLD : RequirementStatus.OPEN,
        notes: "Seeded staff augmentation requirement with vendor broadcast and submission funnel context.",
        updatedById: pick(context.users, index).id,
        deletedAt: null,
      },
    });

    requirements.push(requirement);
  }

  return requirements;
}

async function seedSubmissionsInterviewsPlacements(
  context: TenantSeedContext,
  target: TenantSeedTarget,
  vendors: Vendor[],
  candidates: Candidate[],
  requirements: StaffAugRequirement[],
): Promise<void> {
  const submissionStatuses = [
    SubmissionStatus.SUBMITTED,
    SubmissionStatus.TECHNICAL_REVIEW,
    SubmissionStatus.CLIENT_SUBMITTED,
    SubmissionStatus.INTERVIEW_SCHEDULED,
    SubmissionStatus.SELECTED,
    SubmissionStatus.REJECTED,
  ] as const;
  const submissionRecords: Array<{
    id: string;
    candidateId: string;
    requirementId: string;
    vendorId: string | null;
  }> = [];

  for (let index = 0; index < target.submissions; index += 1) {
    const candidate = pick(candidates, index * 2 + 1);
    const requirement = pick(requirements, index);
    const vendor = candidate.vendorId ? vendors.find((item) => item.id === candidate.vendorId) ?? pick(vendors, index) : pick(vendors, index);
    const status = index < target.placements ? SubmissionStatus.SELECTED : pick(submissionStatuses, index);
    const submissionId = stableUuid(`${target.slug}:submission:${index}`);

    await prisma.candidateSubmission.upsert({
      where: { id: submissionId },
      create: {
        id: submissionId,
        tenantId: context.tenant.id,
        requirementId: requirement.id,
        candidateId: candidate.id,
        vendorId: vendor.id,
        status,
        technicalReviewNotes: "Seeded technical screen notes: skills match and communication acceptable.",
        technicalReviewedAt: index % 2 === 0 ? daysFromBase(-6 + index) : null,
        clientSubmittedAt: index % 3 === 0 || status === SubmissionStatus.SELECTED ? daysFromBase(-4 + index) : null,
        interviewScheduledAt: index < target.interviews ? daysFromBase(1 + index) : null,
        interviewPlaceholder: index < target.interviews ? "Client technical round" : null,
        feedback: status === SubmissionStatus.REJECTED ? "Client preferred stronger cloud experience." : null,
        feedbackRating: status === SubmissionStatus.REJECTED ? 3 : index % 4 === 0 ? 5 : 4,
        submittedAt: daysFromBase(-10 + index),
        createdById: pick(context.users, index + 1).id,
      },
      update: {
        requirementId: requirement.id,
        candidateId: candidate.id,
        vendorId: vendor.id,
        status,
        technicalReviewNotes: "Seeded technical screen notes: skills match and communication acceptable.",
        technicalReviewedAt: index % 2 === 0 ? daysFromBase(-6 + index) : null,
        clientSubmittedAt: index % 3 === 0 || status === SubmissionStatus.SELECTED ? daysFromBase(-4 + index) : null,
        interviewScheduledAt: index < target.interviews ? daysFromBase(1 + index) : null,
        interviewPlaceholder: index < target.interviews ? "Client technical round" : null,
        feedback: status === SubmissionStatus.REJECTED ? "Client preferred stronger cloud experience." : null,
        feedbackRating: status === SubmissionStatus.REJECTED ? 3 : index % 4 === 0 ? 5 : 4,
        submittedAt: daysFromBase(-10 + index),
        updatedById: pick(context.users, index + 1).id,
        deletedAt: null,
      },
    });

    submissionRecords.push({
      id: submissionId,
      candidateId: candidate.id,
      requirementId: requirement.id,
      vendorId: vendor.id,
    });
  }

  for (let index = 0; index < target.interviews; index += 1) {
    const submission = pick(submissionRecords, index);
    await prisma.interview.upsert({
      where: { id: stableUuid(`${target.slug}:interview:${index}`) },
      create: {
        id: stableUuid(`${target.slug}:interview:${index}`),
        tenantId: context.tenant.id,
        submissionId: submission.id,
        candidateId: submission.candidateId,
        requirementId: submission.requirementId,
        vendorId: submission.vendorId,
        roundNumber: 1 + (index % 3),
        interviewer: `${pick(firstNames, index + 8)} ${pick(lastNames, index + 4)}, Client Engineering`,
        scheduledAt: daysFromBase(index - 2, 2),
        feedback: index % 3 === 0 ? "Strong fundamentals, proceed to next discussion." : "Awaiting client feedback.",
        outcome: index % 5 === 0 ? InterviewOutcome.PASSED : InterviewOutcome.PENDING,
        createdById: pick(context.users, index).id,
      },
      update: {
        submissionId: submission.id,
        candidateId: submission.candidateId,
        requirementId: submission.requirementId,
        vendorId: submission.vendorId,
        roundNumber: 1 + (index % 3),
        interviewer: `${pick(firstNames, index + 8)} ${pick(lastNames, index + 4)}, Client Engineering`,
        scheduledAt: daysFromBase(index - 2, 2),
        feedback: index % 3 === 0 ? "Strong fundamentals, proceed to next discussion." : "Awaiting client feedback.",
        outcome: index % 5 === 0 ? InterviewOutcome.PASSED : InterviewOutcome.PENDING,
        updatedById: pick(context.users, index).id,
        deletedAt: null,
      },
    });
  }

  for (let index = 0; index < target.placements; index += 1) {
    const submission = pick(submissionRecords, index);
    const billingRate = amountCents(2.2 + index * 0.35);
    const vendorCost = amountCents(1.45 + index * 0.25);
    const margin = billingRate - vendorCost;
    await prisma.placement.upsert({
      where: { submissionId: submission.id },
      create: {
        id: stableUuid(`${target.slug}:placement:${index}`),
        tenantId: context.tenant.id,
        submissionId: submission.id,
        candidateId: submission.candidateId,
        requirementId: submission.requirementId,
        vendorId: submission.vendorId,
        clientBillingRateCents: billingRate,
        vendorCostCents: vendorCost,
        marginCents: margin,
        marginPercentBasis: Math.round((margin / billingRate) * 10_000),
        currency: "INR",
        joiningDate: daysFromBase(10 + index * 7),
        replacementPeriodDays: 30,
        billingStatus: index % 2 === 0 ? PlacementBillingStatus.ACTIVE : PlacementBillingStatus.NOT_STARTED,
        notes: "Seeded placement revenue for finance dashboard and reports.",
        createdById: pick(context.users, index).id,
      },
      update: {
        candidateId: submission.candidateId,
        requirementId: submission.requirementId,
        vendorId: submission.vendorId,
        clientBillingRateCents: billingRate,
        vendorCostCents: vendorCost,
        marginCents: margin,
        marginPercentBasis: Math.round((margin / billingRate) * 10_000),
        currency: "INR",
        joiningDate: daysFromBase(10 + index * 7),
        replacementPeriodDays: 30,
        billingStatus: index % 2 === 0 ? PlacementBillingStatus.ACTIVE : PlacementBillingStatus.NOT_STARTED,
        notes: "Seeded placement revenue for finance dashboard and reports.",
        updatedById: pick(context.users, index).id,
        deletedAt: null,
      },
    });
  }
}

async function seedActivitiesAndTimeline(context: TenantSeedContext, target: TenantSeedTarget, data: BusinessSeedContext): Promise<void> {
  const activityTitles = [
    "Follow up on proposal commercials",
    "Schedule discovery call",
    "Send candidate shortlist",
    "Review vendor broadcast responses",
    "Update opportunity stage",
    "Capture client feedback",
  ] as const;
  const activityCount = Math.round(target.leads * 0.8);

  for (let index = 0; index < activityCount; index += 1) {
    const type = pick([ActivityType.CALL, ActivityType.EMAIL, ActivityType.MEETING, ActivityType.TASK, ActivityType.NOTE] as const, index);
    const isDone = index % 4 === 0;
    await prisma.crmActivity.upsert({
      where: { id: stableUuid(`${target.slug}:activity:${index}`) },
      create: {
        id: stableUuid(`${target.slug}:activity:${index}`),
        tenantId: context.tenant.id,
        type,
        status: isDone ? ActivityStatus.COMPLETED : ActivityStatus.OPEN,
        title: pick(activityTitles, index),
        description: "Seeded CRM activity for dashboard queues, timelines, and reminders.",
        ownerId: pick(context.users, index).id,
        leadId: index % 3 === 0 ? pick(data.leads, index).id : null,
        accountId: index % 3 === 1 ? pick(data.accounts, index).id : null,
        contactId: index % 4 === 0 ? pick(data.contacts, index).id : null,
        opportunityId: index % 3 === 2 ? pick(data.opportunities, index).id : null,
        vendorId: index % 7 === 0 ? pick(data.vendors, index).id : null,
        candidateId: index % 5 === 0 ? pick(data.candidates, index).id : null,
        dueAt: daysFromBase((index % 12) - 5),
        reminderAt: type === ActivityType.TASK ? daysFromBase((index % 10) - 2, 1) : null,
        completedAt: isDone ? daysFromBase(-index % 10) : null,
        createdById: pick(context.users, index).id,
      },
      update: {
        type,
        status: isDone ? ActivityStatus.COMPLETED : ActivityStatus.OPEN,
        title: pick(activityTitles, index),
        description: "Seeded CRM activity for dashboard queues, timelines, and reminders.",
        ownerId: pick(context.users, index).id,
        leadId: index % 3 === 0 ? pick(data.leads, index).id : null,
        accountId: index % 3 === 1 ? pick(data.accounts, index).id : null,
        contactId: index % 4 === 0 ? pick(data.contacts, index).id : null,
        opportunityId: index % 3 === 2 ? pick(data.opportunities, index).id : null,
        vendorId: index % 7 === 0 ? pick(data.vendors, index).id : null,
        candidateId: index % 5 === 0 ? pick(data.candidates, index).id : null,
        dueAt: daysFromBase((index % 12) - 5),
        reminderAt: type === ActivityType.TASK ? daysFromBase((index % 10) - 2, 1) : null,
        completedAt: isDone ? daysFromBase(-index % 10) : null,
        updatedById: pick(context.users, index).id,
        deletedAt: null,
      },
    });
  }

  for (let index = 0; index < 10; index += 1) {
    await prisma.crmActivity.upsert({
      where: { id: stableUuid(`${target.slug}:notification:${index}`) },
      create: {
        id: stableUuid(`${target.slug}:notification:${index}`),
        tenantId: context.tenant.id,
        type: ActivityType.TASK,
        status: ActivityStatus.OPEN,
        title: `Notification: ${pick(["Approval pending", "Interview today", "Follow-up overdue", "Vendor response received"], index)}`,
        description: "Notification-style reminder seeded as a CRM task because the schema has no Notification model.",
        ownerId: pick(context.users, index).id,
        opportunityId: index % 2 === 0 ? pick(data.opportunities, index).id : null,
        candidateId: index % 2 === 1 ? pick(data.candidates, index).id : null,
        dueAt: daysFromBase(index % 4),
        reminderAt: daysFromBase(index % 4, 1),
        createdById: pick(context.users, index).id,
      },
      update: {
        type: ActivityType.TASK,
        status: ActivityStatus.OPEN,
        title: `Notification: ${pick(["Approval pending", "Interview today", "Follow-up overdue", "Vendor response received"], index)}`,
        description: "Notification-style reminder seeded as a CRM task because the schema has no Notification model.",
        ownerId: pick(context.users, index).id,
        opportunityId: index % 2 === 0 ? pick(data.opportunities, index).id : null,
        candidateId: index % 2 === 1 ? pick(data.candidates, index).id : null,
        dueAt: daysFromBase(index % 4),
        reminderAt: daysFromBase(index % 4, 1),
        updatedById: pick(context.users, index).id,
        deletedAt: null,
      },
    });
  }

  for (let index = 0; index < 20; index += 1) {
    await prisma.activityTimelineItem.upsert({
      where: { id: stableUuid(`${target.slug}:timeline:${index}`) },
      create: {
        id: stableUuid(`${target.slug}:timeline:${index}`),
        tenantId: context.tenant.id,
        leadId: index % 4 === 0 ? pick(data.leads, index).id : null,
        accountId: index % 4 === 1 ? pick(data.accounts, index).id : null,
        contactId: index % 5 === 0 ? pick(data.contacts, index).id : null,
        opportunityId: index % 4 === 2 ? pick(data.opportunities, index).id : null,
        type: pick(["lead.created", "stage.changed", "proposal.sent", "note.added", "candidate.submitted"] as const, index),
        title: pick(["Lead qualified", "Opportunity advanced", "Proposal shared", "Client note added", "Candidate submitted"], index),
        description: "Seeded timeline entry for detail-page activity history.",
        occurredAt: daysFromBase(-index),
        createdById: pick(context.users, index).id,
      },
      update: {
        leadId: index % 4 === 0 ? pick(data.leads, index).id : null,
        accountId: index % 4 === 1 ? pick(data.accounts, index).id : null,
        contactId: index % 5 === 0 ? pick(data.contacts, index).id : null,
        opportunityId: index % 4 === 2 ? pick(data.opportunities, index).id : null,
        type: pick(["lead.created", "stage.changed", "proposal.sent", "note.added", "candidate.submitted"] as const, index),
        title: pick(["Lead qualified", "Opportunity advanced", "Proposal shared", "Client note added", "Candidate submitted"], index),
        description: "Seeded timeline entry for detail-page activity history.",
        occurredAt: daysFromBase(-index),
        updatedById: pick(context.users, index).id,
        deletedAt: null,
      },
    });
  }
}

async function seedAuditLogs(contexts: Map<string, TenantSeedContext>): Promise<void> {
  const tenantContexts = Array.from(contexts.values());
  const actions = [
    "auth.login.succeeded",
    "lead.created",
    "opportunity.stage_changed",
    "proposal.approved",
    "candidate.submitted",
    "vendor.updated",
    "settings.updated",
    "report.export.requested",
  ] as const;

  for (let index = 0; index < 100; index += 1) {
    const context = pick(tenantContexts, index);
    const actor = pick(context.users, index);
    await prisma.auditLog.upsert({
      where: { id: stableUuid(`audit:${index}`) },
      create: {
        id: stableUuid(`audit:${index}`),
        tenantId: context.tenant.id,
        actorUserId: actor.id,
        action: pick(actions, index),
        entityType: pick(["user", "lead", "opportunity", "proposal", "candidate", "vendor", "settings", "report"] as const, index),
        entityId: stableUuid(`audit-entity:${index}`),
        ipAddress: `103.21.${index % 255}.${10 + (index % 120)}`,
        userAgent: "SeedBrowser/1.0 CRM Demo",
        metadata: {
          seed: "dummy-data",
          sequence: index,
          tenant: context.tenant.slug,
        } satisfies Prisma.InputJsonValue,
        createdAt: daysFromBase(-index),
        createdById: actor.id,
      },
      update: {
        tenantId: context.tenant.id,
        actorUserId: actor.id,
        action: pick(actions, index),
        entityType: pick(["user", "lead", "opportunity", "proposal", "candidate", "vendor", "settings", "report"] as const, index),
        entityId: stableUuid(`audit-entity:${index}`),
        ipAddress: `103.21.${index % 255}.${10 + (index % 120)}`,
        userAgent: "SeedBrowser/1.0 CRM Demo",
        metadata: {
          seed: "dummy-data",
          sequence: index,
          tenant: context.tenant.slug,
        } satisfies Prisma.InputJsonValue,
        createdAt: daysFromBase(-index),
        updatedById: actor.id,
        deletedAt: null,
      },
    });
  }
}

async function seedTenantBusinessData(context: TenantSeedContext, target: TenantSeedTarget): Promise<void> {
  const accounts = await seedAccounts(context, target);
  const contacts = await seedContacts(context, target, accounts);
  const leads = await seedLeads(context, target);
  const opportunities = await seedOpportunities(context, target, accounts, contacts, leads);
  await seedProposals(context, target, accounts, contacts, opportunities);
  const vendors = await seedVendors(context, target);
  const candidates = await seedCandidates(context, target, vendors);
  const requirements = await seedRequirements(context, target, accounts, opportunities);
  await seedSubmissionsInterviewsPlacements(context, target, vendors, candidates, requirements);
  await seedActivitiesAndTimeline(context, target, {
    accounts,
    contacts,
    leads,
    opportunities,
    vendors,
    candidates,
    requirements,
  });
}

async function main(): Promise<void> {
  const developmentPasswordHash = await bcrypt.hash(developmentPassword, 12);
  const permissionIds = await upsertPermissions();
  const tenants = await seedTenants();
  const roles = await seedRoles(permissionIds, tenants);
  const contexts = await seedUsers(developmentPasswordHash, tenants, roles);

  for (const target of tenantTargets) {
    const context = contexts.get(target.slug);
    if (!context) {
      throw new Error(`Missing seed context for tenant ${target.slug}`);
    }

    await seedTenantBusinessData(context, target);
  }

  await seedAuditLogs(contexts);

  console.warn("Dummy CRM seed complete: 3 tenants, 20 users, 100 leads, 30 accounts, 50 contacts, 25 opportunities, 10 proposals, 15 vendors, 100 candidates, 20 requirements, 50 submissions, 10 interviews, 5 placements, activities, notification reminders, and audit logs.");
}

main()
  .catch((error: unknown) => {
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
