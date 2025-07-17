# Company Management Microservice Documentation

## Overview

The Company Management microservice is a **CORE BUILT-IN FEATURE** of the LeafyHealth Platform that provides comprehensive multi-company and multi-branch management capabilities. This service is fundamental to the platform's architecture, enabling automatic branch context propagation throughout the entire system.

**Service Port**: 3013  
**Base Path**: `/api/company-management`  
**NestJS Module**: `backend/domains/company-management`

## Architecture

### Core Components

1. **Controller**: `company-management.controller.ts`
   - Handles HTTP requests
   - Validates input data
   - Routes to appropriate service methods

2. **Service**: `company-management.service.ts`
   - Contains business logic
   - Interacts with database
   - Implements multi-branch filtering

3. **DTOs**: `company-management.dto.ts`
   - Data validation schemas
   - Type-safe request/response objects

4. **Entities**: `company-management.entity.ts`
   - Database table definitions
   - TypeORM entity mappings

### Database Schema

#### Companies Table
```sql
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  logo VARCHAR(500),
  website VARCHAR(500),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'India',
  postal_code VARCHAR(20),
  tax_id VARCHAR(50),
  registration_number VARCHAR(50),
  fssai_license VARCHAR(20),
  gst_number VARCHAR(20),
  industry VARCHAR(100),
  founded_year INTEGER,
  primary_color VARCHAR(7),
  secondary_color VARCHAR(7),
  accent_color VARCHAR(7),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Branches Table
```sql
CREATE TABLE branches (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(50) DEFAULT 'retail',
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'India',
  postal_code VARCHAR(20),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone VARCHAR(20),
  email VARCHAR(255),
  manager_name VARCHAR(255),
  gst_number VARCHAR(20),
  operating_hours VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### Company Management

#### 1. Create Company
- **POST** `/api/company-management/companies`
- **Request Body**:
```json
{
  "name": "Sri Venkateswara Organic Foods",
  "description": "Premium organic food retailer",
  "email": "info@svorganicfoods.com",
  "phone": "+91-8885551234",
  "address": "Plot No. 45, HITEC City",
  "city": "Hyderabad",
  "state": "Telangana",
  "postalCode": "500081",
  "fssaiLicense": "12345678901234",
  "gstNumber": "36AABCS1234F1Z5"
}
```

#### 2. Get All Companies
- **GET** `/api/company-management/companies`
- **Response**: Array of company objects with branch and employee counts

#### 3. Get Company by ID
- **GET** `/api/company-management/companies/:id`
- **Response**: Single company object with detailed information

#### 4. Update Company
- **PUT** `/api/company-management/companies/:id`
- **Request Body**: Partial company object with fields to update

#### 5. Delete Company
- **DELETE** `/api/company-management/companies/:id`
- **Note**: Soft delete - sets `is_active` to false

### Branch Management

#### 1. Create Branch
- **POST** `/api/company-management/branches`
- **Request Body**:
```json
{
  "companyId": "1",
  "name": "SVOF Hyderabad Main",
  "code": "HYD001",
  "type": "retail",
  "address": "Shop No. 12, Road No. 36, Jubilee Hills",
  "city": "Hyderabad",
  "state": "Telangana",
  "postalCode": "500033",
  "phone": "+91-8885551234",
  "email": "hyd001@svorganicfoods.com",
  "managerName": "Rajesh Kumar",
  "isActive": true
}
```

#### 2. Get All Branches
- **GET** `/api/company-management/branches`
- **Response**: Array of all branches across all companies

#### 3. Get Branch by ID
- **GET** `/api/company-management/branches/:id`
- **Response**: Single branch object

#### 4. Update Branch
- **PUT** `/api/company-management/branches/:id`
- **Request Body**: Partial branch object with fields to update

#### 5. Delete Branch
- **DELETE** `/api/company-management/branches/:id`
- **Note**: Soft delete - sets `is_active` to false

#### 6. Get Branches by Company
- **GET** `/api/company-management/companies/:companyId/branches`
- **Response**: Array of branches for specific company

## Multi-Branch Architecture

### Branch Context Middleware

The service implements automatic branch context detection from:
1. JWT token (primary source)
2. `X-Branch-ID` header
3. `branchId` query parameter

### Branch Isolation

All business data is automatically filtered by branch context:
- Products are branch-specific
- Inventory is tracked per branch
- Orders are associated with branches
- Employees are assigned to branches

### Service Integration

The Company Management service integrates with:
- **Authentication Service**: Adds branchId to JWT tokens
- **All Business Services**: Provides branch context for data filtering
- **Direct Data Gateway**: Supplies branch data for frontend

## Frontend Integration

### Super Admin Pages

1. **Company Management** (`/superadmin/company-management`)
   - Lists all companies with branch counts
   - Create/Edit/Delete companies
   - Navigate to branch management

2. **Branch Management** (`/superadmin/branch-management?companyId=1`)
   - Lists branches for selected company
   - Create/Edit/Delete branches
   - Manage branch settings

### API Usage Example

```typescript
// Fetch companies
const response = await fetch('/api/company-management/companies');
const companies = await response.json();

// Create branch
const newBranch = await fetch('/api/company-management/branches', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    companyId: '1',
    name: 'New Branch',
    code: 'NEW001',
    // ... other fields
  })
});
```

## Configuration

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Application environment
- `PORT`: Service port (default: 3013)

### Service Registration
The service is automatically registered in:
- `scripts/smart-microservices-startup.js`
- `server/unified-gateway-fixed.js`
- `shared/port-config.js`

## Health Check

- **Endpoint**: `/api/company-management/health`
- **Response**: 
```json
{
  "status": "healthy",
  "service": "company-management",
  "timestamp": "2025-07-05T23:00:00.000Z"
}
```

## Known Issues & Solutions

### 1. Input Null Value Warning
**Issue**: React warning about null values in input fields  
**Solution**: Ensure all form fields have default empty string values

### 2. WebSocket Connection Errors
**Issue**: HMR WebSocket connection failures  
**Cause**: Development environment proxy issues  
**Impact**: No impact on functionality, only affects hot reload

### 3. Missing Dialog Description Warning
**Issue**: Accessibility warning for dialog components  
**Solution**: Add aria-describedby to dialog content components

## Testing

### Create Test Company
```bash
curl -X POST http://localhost:5000/api/company-management/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Company",
    "email": "test@company.com",
    "phone": "1234567890"
  }'
```

### Create Test Branch
```bash
curl -X POST http://localhost:5000/api/company-management/branches \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": "1",
    "name": "Test Branch",
    "code": "TEST001",
    "type": "retail"
  }'
```

## Development Notes

1. **TypeScript**: Service is fully typed with strict mode
2. **Validation**: Uses class-validator for DTO validation
3. **Database**: Uses raw SQL queries for performance
4. **Error Handling**: Comprehensive error messages with proper HTTP status codes
5. **Logging**: Console logging for debugging (production should use Winston)

## Future Enhancements

1. **Branch Permissions**: Role-based access per branch
2. **Branch Analytics**: Performance metrics per branch
3. **Multi-Currency**: Support for different currencies per branch
4. **Branch Templates**: Predefined branch configurations
5. **Bulk Operations**: Import/export branch data

## Conclusion

The Company Management microservice is the foundation of LeafyHealth's multi-branch architecture. It ensures complete data isolation between branches while providing centralized management capabilities. The service is production-ready with all CRUD operations fully functional and integrated throughout the platform.