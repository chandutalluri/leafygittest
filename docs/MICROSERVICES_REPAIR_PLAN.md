# LeafyHealth Microservices Repair Plan

## Priority Order for Repairs

### Phase 1: Critical Empty Services (Highest Priority)
These services are referenced throughout the platform but have no implementation:

1. **Traditional Orders Service (Port 3050)** - CRITICAL
   - Referenced in gateway but file doesn't exist
   - Needed for traditional home supplies feature
   - Status: File missing at server/traditional-orders-service.js

2. **Image Management (Port 3035)** - CRITICAL
   - Essential for product images
   - Referenced by Product Orchestrator and frontend
   - Status: No implementation found

3. **Product Orchestrator (Port 3042)** - CRITICAL
   - Central service for product creation/updates
   - Integrates with multiple services
   - Status: Empty service, no source files

### Phase 2: Fix Port Misconfigurations
4. **Identity Access (Port 3020)**
   - Currently hardcoded to port 3010 in main.ts
   - Needs port correction and proper implementation

### Phase 3: Add Missing Endpoints
5. **Authentication Service**
   - Move endpoints from root to /api/auth/ path
   - Add missing /api/auth/logout endpoint

6. **Company Management**
   - Add /health endpoint for monitoring

### Phase 4: Enhance Partial Services
7. **Marketplace Management (Port 3036)**
   - Add vendor management
   - Product listing APIs

8. **Subscription Management (Port 3037)**
   - Customer subscription CRUD
   - Payment integration

## Repair Strategy

### For Each Service:
1. **Health Check** - Ensure /health endpoint exists
2. **API Documentation** - Swagger/OpenAPI docs at /api/docs
3. **Database Integration** - Connect to PostgreSQL with proper models
4. **Business Logic** - Implement core CRUD operations
5. **Error Handling** - Proper error responses and logging
6. **Testing** - Verify endpoints work with real data

## Starting Point: Traditional Orders Service

This is the most critical as it's actively referenced but completely missing.

### Traditional Orders Requirements:
- Categories: Rice, Dal, Spices, Oils, etc.
- Items with Telugu translations
- Branch-specific pricing (ordinary/medium/best quality)
- Order management endpoints
- Integration with Order Management service
