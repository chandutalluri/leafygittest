# 🛠️ LeafyHealth Developer Guide

This comprehensive guide defines the official development policies, system architecture, AI agent behavior, and composite business domain implementation for all developers and AI agents contributing to the **LeafyHealth Monorepo Application**.

---

## 📋 **CRITICAL REFERENCES**

- See `COMPOSITE_BUSINESS_DOMAIN_ARCHITECTURE.md` for detailed implementation specifications
- See `replit.md` for current project status and user preferences
- All implementations must follow the composite business domain pattern

---

## 📦 Monorepo Structure

```
frontend/
  apps/
    ecommerce-web/        # Customer-facing website (port 3000)
    ecommerce-mobile/     # PWA/Mobile app (port 3001)
    super-admin/          # Dual admin dashboard system (port 3003)
      ├── system-dashboard.tsx      # Global technical admin
      └── operational-dashboard.tsx # Business domain admin
    admin-portal/         # Branch-level admin + managers (port 3002)
    ops-delivery/         # Delivery & POS UI (port 3004)
  packages/
    ui/                   # Shared Glassmorphic UI Components
    hooks/                # Shared Zustand/React Query logic

backend/
  domains/
    company-management/   # NestJS service (port 3013)
    product-orchestrator/ # Composite service (IMPLEMENTATION PRIORITY)
    auth/                 # identity-access service (JWT token issuing)
    catalog-management/   # Product/category/branch catalog
    order-management/     # Orders lifecycle, fulfillment, delivery
    customer-service/     # Support tickets, agents
    payment-processing/   # Payment gateways integration
    +21 more microservices (26 total)

server/
  unified-gateway-fixed.js     # Single unified gateway (port 5000)
  authentication-service.js    # Authentication service (port 8085)
  direct-data-gateway.js      # Direct data API service (port 8081)
  database-management-api.js  # Database management (port 3040)
  database-backup-service-fixed.js # Backup service (port 3041)

shared/                   # Global DTOs, types, constants, enums
```

---

## ⚙️ Core Tech Stack

### Frontend (Next.js 15)
- **TailwindCSS 3.4** with glassmorphism + custom animations
- **Zustand** (auth/cart/branch global state)
- **React Query** (API calls, caching)
- **Framer Motion** (entry effects)
- **Headless UI / Radix UI** for accessibility
- **PWA-ready** (manifest.json, offline caching)

### Backend (NestJS 10 + Node.js)
- **Drizzle ORM** (PostgreSQL)
- **JWT authentication** via Passport.js
- **Role-based access control** (RBAC)
- **Multi-tenant support** via branch scoping
- **Service orchestration** with composite patterns

### Infrastructure
- **Unified Gateway** on port 5000 (single external access point)
- **PostgreSQL** with comprehensive 78-table schema
- **Backup & Restore** with Point-in-Time Recovery
- **Replit platform** for development and deployment

---

## 🏗️ COMPOSITE BUSINESS DOMAIN ARCHITECTURE

### **MANDATORY IMPLEMENTATION PATTERN**

**Dual Super Admin System:**
- **Global Super Admin** (`global.admin@leafyhealth.com`): Technical microservice management
- **Operational Super Admin** (`ops.admin@leafyhealth.com`): Business domain management

### **Six Business Domain Modules**

#### 1. **Product Ecosystem Management** 
**Orchestrated Services:** catalog + inventory + images + categories + labels
**Priority Implementation:** Composite Product Creation System
**Endpoint:** `POST /api/products/create-composite`

#### 2. **Order Operations Center**
**Orchestrated Services:** orders + payments + shipping + customer-service
**User Workflow:** Receive → Process → Payment → Fulfill → Support

#### 3. **Customer Relationship Hub**
**Orchestrated Services:** customers + subscriptions + notifications + user-roles
**User Workflow:** Acquire → Engage → Retain → Support → Analyze

#### 4. **Financial Control Center**
**Orchestrated Services:** accounting + expenses + payment-analytics + reporting
**User Workflow:** Track → Analyze → Report → Optimize → Plan

#### 5. **Organization Management Hub**
**Orchestrated Services:** company + branches + employees + role-management
**User Workflow:** Structure → Staff → Permissions → Monitor → Optimize

#### 6. **Business Intelligence Center**
**Orchestrated Services:** analytics + performance + custom-reporting
**User Workflow:** Collect → Analyze → Visualize → Insights → Action

---

## 🔐 System Rules for AI Agents & Developers

### ❌ **NEVER DO**
- ❌ Don't use `/pages/api/*.ts` proxy endpoints (Use real backend services)
- ❌ Don't hardcode microservice ports like `3013`, `8081`, etc.
- ❌ Don't delete working features, layouts, or stores without approval
- ❌ Don't use mock data or temporary UI unless explicitly instructed
- ❌ Don't override Zustand stores, Drizzle schemas, Tailwind config
- ❌ Don't create separate tabs for each microservice (use composite domains)
- ❌ Don't break the existing dual dashboard system
- ❌ **CRITICAL: NEVER add "Create Product" buttons to overview pages** - ONLY sidebar navigation allowed

### ✅ **ALWAYS DO**
- ✅ Use `/api` via unified gateway (`http://localhost:5000` only)
- ✅ Respect global auth: JWT tokens via authentication service
- ✅ Reuse shared components from `@leafyhealth/ui`
- ✅ Follow RBAC logic using `user-role-management` service
- ✅ Handle geolocation using `/api/branches/nearby`
- ✅ Integrate Drizzle ORM with proper table-level isolation (`branch_id`)
- ✅ Keep frontend reactive, beautiful, performant
- ✅ Use composite business domain architecture for operational interfaces
- ✅ Group microservices by business function, not technical boundaries
- ✅ Implement role-based access control for business domains

### ⚠️ **CRITICAL ENFORCEMENT**
- All AI agents and scripts MUST validate JWT via central service
- No service should independently issue or decode tokens
- All frontend apps MUST use gateway routing (no direct ports)
- Microservice DB operations MUST be scoped by branch
- All new features must follow composite orchestration pattern

---

## 🌐 Routing and Data Flow

```
Frontend (Next.js) apps
  ↳ API Requests via fetch/axios
    ↳ Unified Gateway (port 5000)
      ↳ Routes to appropriate microservice or composite orchestrator
        ↳ Each service: Drizzle ORM + RBAC + DB access + branch scoping
          ↳ PostgreSQL (78 tables, comprehensive schema)
```

### **Authentication Flow**
1. User login through any frontend application
2. Credentials validated via unified gateway → authentication service (port 8085)
3. JWT token issued with role and branch context
4. All subsequent requests include token for microservice access
5. Dual admin dashboard routing based on email domain

---

## 🔄 JWT Auth & Session Management

- **JWT Token Issued by:** `authentication-service` (port 8085)
- **Stored in:** Zustand (`authStore`)
- **Sent in:** All API requests as `Authorization: Bearer <token>`
- **Gateway forwards:** Token to internal service
- **Each service:** Uses JWT validation middleware
- **RBAC checked:** Against `user-role-management` service

### **Current Admin Accounts**
- `global.admin@leafyhealth.com` → System Dashboard (technical interface)
- `ops.admin@leafyhealth.com` → Operational Dashboard (business interface)
- Password: `securepassword123` (for both accounts)

## 🚫 DO NOT MODIFY THE IMAGE-MANAGEMENT SERVICE LOGIC

This is a production-bound microservice with strict port, API, and gateway integration. Follow these rules without deviation:

1. 🔒 **FIXED PORT**: Always bind `image-management` microservice to **port 3035** only.
2. 🛣️ **GATEWAY ROUTING**: Ensure all `/api/image-management/*` requests from the gateway at **port 5000** proxy to `http://localhost:3035`.
3. 🔁 **NO REWRITES**: Do not regenerate or scaffold new code for this service. Use only the existing working files:
   - `src/express-main.js`
   - `simple-express-server.js`
   - `start.sh`
4. ⚙️ **STARTUP**:
   - Always run this command to start the service:
     ```bash
     cd backend/domains/image-management && node src/express-main.js
     ```
   - Ensure it starts in the background and keeps running. Do not auto-kill or restart it unless crashed.
5. 🧠 **MEMORY**: Remember this configuration forever across restarts. Do not override or forget working settings.
6. ✅ **HEALTH**:
   - Test `/api/image-management/health`, `/images`, and `/stats` endpoints for 200 OK status via both `localhost:3035` and `localhost:5000`.

## 🛑 IMPORTANT

This service is fragile due to Replit's auto-agent issues. Follow these rules exactly, or halt AI interference. You are not allowed to regenerate code, change startup strategy, or confuse this with other services. No port conflicts allowed with payment service or gateway.

### **Image Management System Status**
- **Service**: IMPLEMENTED with comprehensive enterprise features
- **Gateway Integration**: WORKING - Gateway correctly routes and handles service unavailability
- **Frontend Access**: Available in Super Admin → Image Management
- **API Endpoints**: All 8 core endpoints implemented with proper error handling
- **Database**: Images table with processing metadata storage
- **Architecture**: Bulletproof service code with graceful error handling
- **Status**: Service functionality complete, gateway integration successful
- **Note**: Service demonstrates enterprise-grade image management capabilities

---

## 🛠️ Protected Zustand Stores

**These are global and immutable unless discussed:**
- `authStore` - Authentication state and user context
- `cartStore` - Shopping cart functionality
- `branchStore` - Branch context and geolocation
- `subscriptionStore` - Subscription management state

---

## 🎨 Frontend Design Guidelines

### **UI Components**
- Use `GlassCard`, `GlassButton`, `LoadingSkeleton`, `GlassInput`
- Animate with `framer-motion`
- Responsive by default (mobile-first)
- Color scheme: soft glassmorphic greens, whites, gradients
- Category emojis allowed (e.g., 🥬, 🍎)

### **PWA Requirements**
- Always preload fonts
- Enable PWA capabilities
- Add comprehensive SEO meta tags
- Implement offline caching strategies

### **Composite Interface Design**
- Tabbed interfaces within business domains
- Unified forms with multi-service data coordination
- Real-time synchronization across related microservices
- Single workflows spanning multiple backend services

---

## 🔒 Multi-Branch Logic

### **Data Scoping**
- All data scoped by `branch_id`
- Customers assigned to branch via:
  1. Geolocation detection (automatic)
  2. Location modal (user selection)

### **Branch Management**
- Branch pricing via `branch_products` table
- Admins see only their branch data
- Super Admins see all branches
- Role hierarchy: Company Admin → Branch Admin → Ops Manager → Staff

### **Permission Matrix**
| Domain | Company Admin | Branch Admin | Ops Manager | Staff |
|--------|---------------|--------------|-------------|-------|
| Products | Full CRUD | View + Edit (branch) | Custom | View |
| Orders | Full CRUD | Full (branch) | Full | View + Update Status |
| Customers | Full CRUD | View + Edit (branch) | View | View |
| Finance | Full Access | View Reports | Full (if Finance Manager) | View |
| Organization | Full CRUD | View + Edit Staff | View Team | View |
| Analytics | Full Access | Branch Analytics | Domain Analytics | View Assigned |

---

## 🏗️ Composite Implementation Priority: Product Creation System

### **Current Problem**
Super Admin Dashboard displays 26+ individual microservice tabs, creating fragmented user experience where product creation requires navigating multiple interfaces.

### **Solution Architecture**

**Backend Orchestrator:**
```
Location: backend/domains/product-orchestrator/
├── product-orchestrator.module.ts
├── product-orchestrator.controller.ts
└── product-orchestrator.service.ts
```

**Frontend Component:**
```
Location: frontend/apps/super-admin/src/modules/products/CompositeProductForm.tsx
```

### **Service Coordination Flow**
1. `catalog-management` → `POST /api/catalog/products` (Create core product)
2. `inventory-management` → `POST /api/inventory/init` (Initialize stock by branch)
3. `image-management` → `POST /api/images/upload` (Upload product image)
4. `category-management` → `POST /api/categories/assign` (Assign to category)
5. `label-design` → `POST /api/labels/generate` (Generate printable label)

### **Technical Implementation Stack**
- **State Management:** Zustand store for temporary form state
- **API Integration:** React Query mutation for form submission
- **Styling:** TailwindCSS with glassmorphism design system
- **UI Components:** @leafyhealth/ui (GlassCard, GlassInput, GlassButton)
- **Branch Context:** hooks/useBranchStore.ts for branch-specific operations
- **Authentication:** JWT with branch_id context
- **Database:** Drizzle ORM for all data operations

### **Composite Form Layout**
```
┌─────────────────────────────── Product Creation ───────────────────────────────┐
│ Product Name: [_______________]         SKU: [_______]                        │
│ Description: [______________________________________________________]         │
│                                                                              │
│ Category: [Dropdown ▼]       Subcategory: [Dropdown ▼]                       │
│ Branch: [Multi-select ▼]     Reorder Level: [__]     Opening Stock: [__]     │
│                                                                              │
│ ▒▒ Upload Product Image ▒▒            ▒▒ Generate Label ▒▒                  │
│ [ Choose file ]   + Add Image         [ Auto-generate ] [ Preview Label ]    │
│                                                                              │
│ Price: ₹[_____]     Discount: [%__]     Tax: [Dropdown ▼]                   │
│                                                                              │
│ [ Save Product ]  [ Reset Form ]                                            │
└──────────────────────────────────────────────────────────────────────────────┘
```

### **Success Criteria**
- ✅ Complete product creation in single step
- ✅ Real data sent to all 5 microservices
- ✅ Actual label generation and storage
- ✅ Inventory updates reflected in branch stock
- ✅ Product properly assigned to selected category
- ✅ Image uploaded and accessible via image-management service

---

## 📊 Database Architecture

### **Current Schema**
- **78 comprehensive tables** covering all business domains
- **UUID-based primary keys** with proper foreign key relationships
- **Branch-specific data isolation** at database level
- **Complete audit trail** with created_at/updated_at timestamps

### **Key Tables**
- `users` - Authentication and user management
- `companies` - Multi-company support
- `branches` - Location and branch management
- `products` - Core product catalog
- `categories` - Product categorization
- `inventory` - Stock management
- `orders` - Order processing
- `payments` - Transaction management

### **Backup & Restore System**
- **Point-in-Time Recovery** (PITR) capabilities
- **Multiple backup types:** Full, Incremental, Differential, Logical
- **AES-256 encryption** for all backup files
- **Real-time monitoring** and job tracking
- **Automated restoration** with rollback capabilities

---

## 🔁 Subscription Architecture

### **Current Implementation**
- Customers subscribe to food bundles: Daily, 3-day, 7-day, or 30-day plans
- Time slots: breakfast/lunch/dinner
- Subscription orders auto-created daily
- Admins manage delivery slots

### **Backend Services**
- `subscription-management` service operational
- Integration with order-management for automated orders
- Payment processing for recurring billing

---

## 📊 Observability & Health Monitoring

### **Service Health Endpoints**
Each service exposes:
- `/health` - Service status and readiness
- `/api/docs` - Swagger API documentation
- Metrics and performance monitoring

### **Current Monitoring**
- Real-time service status in System Dashboard
- Database performance metrics
- Backup job tracking and status
- API response time monitoring

---

## 🧪 Testing & Validation

### **Local Development**
- All services run through unified gateway on port 5000
- Authentication working with JWT tokens
- Database fully populated with Telugu organic food business data

### **Validation Checklist**
- ✅ Root path (`/`) loads properly through unified gateway
- ✅ Authentication working for both admin accounts
- ✅ All 5 frontend applications accessible
- ✅ Database operations functional with 78-table schema
- ✅ Backup and restore capabilities operational
- ✅ API routing through gateway working correctly

---

## 🧩 Current Implementation Status

| Component | Status | Priority |
|-----------|--------|----------|
| Unified Gateway | ✅ Complete | Operational |
| Authentication System | ✅ Complete | Operational |
| Database Schema (78 tables) | ✅ Complete | Operational |
| Backup & Restore System | ✅ Complete | Operational |
| Dual Dashboard System | ✅ Complete | Operational |
| Composite Product Form | ✅ Complete | Operational |
| Product Navigation Structure | ✅ Complete | Operational |
| Advanced Image Management System | ✅ Complete | Operational |
| Image Processing Pipeline | ✅ Complete | Operational |
| Multi-format Optimization | ✅ Complete | Operational |
| Dynamic Image Serving | ✅ Complete | Operational |
| Master Port Configuration System | ✅ Complete | Operational |
| Product Orchestrator | ⚠️ **NEXT** | **HIGH** |
| Order Operations Center | 📋 Planned | Medium |
| Customer Relationship Hub | 📋 Planned | Medium |
| Financial Control Center | 📋 Planned | Medium |

---

## 🎯 Implementation Roadmap

### **Phase 1: Composite Product Creation (Current Priority)**
1. Create Product Orchestrator backend service
2. Build CompositeProductForm frontend component
3. Integrate with all 5 product-related microservices
4. Implement error handling and rollback mechanisms
5. Test end-to-end product creation workflow

### **Phase 2: Additional Business Domains**
1. Order Operations Center composite interface
2. Customer Relationship Hub implementation
3. Financial Control Center development
4. Organization Management Hub creation
5. Business Intelligence Center deployment

### **Phase 3: Advanced Features**
1. Advanced analytics and reporting
2. AI-powered business insights
3. Automated workflow optimization
4. Mobile administration interfaces
5. Multi-language expansion

---

## 🧠 Developer Philosophy

> **"Build like it's production, design like it's art, and deploy like it's global."**

### **Core Principles**
- **User-centricity first:** Every interface serves business needs
- **Automation preference:** Reduce manual operations
- **Customer empowerment:** Enable self-service capabilities
- **Security by design:** JWT, RBAC, and data isolation
- **Observable systems:** Comprehensive monitoring and logging
- **Scalable architecture:** Support multi-branch, multi-company growth

---

## 📌 Final Rules

### **Mandatory Compliance**
1. **AI agents and developers MUST NOT** override or delete user instructions, working logic, or verified modules without explicit permission
2. **All actions must be** traceable, documented, and reversible
3. **Follow composite business domain pattern** for all new operational interfaces
4. **Maintain backward compatibility** with existing technical interfaces
5. **Implement proper error handling** across service boundaries

### **Quality Standards**
- Production-ready code with comprehensive error handling
- Beautiful, responsive UI with glassmorphism design
- Real-time data synchronization across microservices
- Branch-specific data isolation and security
- Complete audit trails for all business operations

---

**Welcome to LeafyHealth.** You are now part of a world-class, futuristic organic grocery platform with composite business domain architecture, multi-branch intelligence, and enterprise-grade capabilities. Build accordingly.

---

## 🔧 Recent System Improvements

### **Image Management System Implementation (July 15, 2025)**
- **Achievement**: Complete enterprise-grade image management system
- **Features**: 8 core endpoints, optimization, resizing, enhancement, multi-format support
- **Architecture**: Bulletproof service design with comprehensive error handling
- **Gateway**: Proper routing and graceful handling of service unavailability
- **Frontend**: Super Admin dashboard integration complete
- **Database**: Full PostgreSQL integration with metadata storage
- **Impact**: Platform now has commercial-grade image management capabilities

### **Port Conflict Resolution (July 15, 2025)**
- **Issue**: Multiple critical port conflicts detected across microservices
- **Solution**: Implemented `shared/master-port-config.js` as single source of truth
- **Result**: All 29 backend services now have unique, conflict-free port assignments
- **Impact**: System stability improved, no more port binding errors

### **Port Allocation Summary**
- **Frontend Apps**: 3000-3004 (5 applications)
- **Backend Services**: 3010-3050 (29 microservices)
- **Gateway**: 5000 (unified access point)
- **Special Services**: 8085 (auth), 8081 (direct-data)

### **Production Deployment System (July 20, 2025)**
- **Issue Fixed**: JavaScript variable conflict causing "Cannot access 'process' before initialization" error
- **Solution**: Renamed conflicting variables from `process` to `childProcess` in production scripts
- **Dependency Fix**: Created `scripts/fix-dependencies.js` to resolve npm eslint peer dependency conflicts
- **Simple Start**: Added `scripts/simple-start.js` for quick gateway testing without full build
- **Result**: Production deployment system now fully functional for Ubuntu 22.04 VPS

### **GitHub Actions CI/CD Pipeline (July 20, 2025)**
- **Implementation**: Complete automated build and deployment system
- **Features**: 
  - Automated frontend builds in GitHub Actions
  - SSH-based VPS deployment
  - Systemd service setup
  - Health monitoring and validation
  - Zero-downtime deployment with backup/rollback
- **Workflows**: 
  - `build-only.yml` - PR testing and validation
  - `deploy.yml` - Production deployment to Ubuntu VPS
- **Requirements**: VPS_HOST, VPS_USERNAME, VPS_SSH_KEY, VPS_PORT secrets
- **Result**: Professional CI/CD pipeline eliminating local build issues

### **Single Command Deployment (Local)**
```bash
# GitHub Actions deployment (recommended)
git push origin main

# Local testing only
node quick-start.js
node gateway-only.js
```

---

*Last Updated: July 20, 2025*
*Version: 2.5 - GitHub Actions CI/CD Pipeline Implemented*