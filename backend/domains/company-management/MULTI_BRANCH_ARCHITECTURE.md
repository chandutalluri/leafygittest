# Multi-Branch Architecture Implementation Plan
## Company Management Microservice Core Feature

### Overview
Multi-branch functionality will be implemented as a core, built-in feature of the Company Management microservice, ensuring automatic propagation throughout the entire system.

### Core Principles
1. **Branch Context is Mandatory** - Every operation MUST have a branch context
2. **Automatic Branch Filtering** - All queries automatically filter by branch
3. **Branch Inheritance** - Child entities inherit branch context from parent
4. **Cross-Branch Isolation** - Data from different branches is completely isolated
5. **Branch-Aware APIs** - All endpoints automatically handle branch context

### Implementation Architecture

#### 1. Database Schema Enhancements
```sql
-- Enhanced companies table
ALTER TABLE companies ADD COLUMN IF NOT EXISTS 
  enable_multi_branch BOOLEAN DEFAULT true,
  default_branch_id INTEGER;

-- Enhanced branches table  
ALTER TABLE branches ADD COLUMN IF NOT EXISTS
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
  currency VARCHAR(3) DEFAULT 'INR',
  language VARCHAR(10) DEFAULT 'en',
  settings JSONB DEFAULT '{}';

-- Branch context table for all entities
CREATE TABLE IF NOT EXISTS branch_contexts (
  id SERIAL PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL, -- 'product', 'order', 'customer', etc.
  entity_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL REFERENCES branches(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(entity_type, entity_id, branch_id)
);

-- Add branch_id to ALL business tables
-- This will be done programmatically for all tables
```

#### 2. Middleware Implementation
```typescript
// Branch Context Middleware
@Injectable()
export class BranchContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Extract branch context from:
    // 1. JWT token (primary)
    // 2. Query parameter (fallback)
    // 3. Header (X-Branch-ID)
    // 4. Default branch for company
    
    const branchId = this.extractBranchContext(req);
    if (!branchId && !this.isExemptEndpoint(req.path)) {
      throw new BadRequestException('Branch context is required');
    }
    
    req['branchContext'] = { branchId };
    next();
  }
}
```

#### 3. Service Layer Enhancements
```typescript
// Base Multi-Branch Service
@Injectable()
export abstract class MultiBranchService<T> {
  protected abstract tableName: string;
  
  async findAll(branchId: number): Promise<T[]> {
    return await db
      .select()
      .from(this.table)
      .where(eq(this.table.branchId, branchId));
  }
  
  async create(data: any, branchId: number): Promise<T> {
    return await db
      .insert(this.table)
      .values({ ...data, branchId })
      .returning();
  }
  
  // Automatic branch filtering for all operations
}
```

#### 4. Controller Decorators
```typescript
// Custom decorators for branch context
export const BranchContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.branchContext;
  },
);

export const RequireBranch = () => {
  return applyDecorators(
    UseGuards(BranchContextGuard),
    ApiHeader({
      name: 'X-Branch-ID',
      description: 'Branch context for the request',
      required: true,
    }),
  );
};
```

#### 5. Automatic Branch Propagation
```typescript
// Branch Propagation Interceptor
@Injectable()
export class BranchPropagationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const branchContext = request.branchContext;
    
    return next.handle().pipe(
      map(data => {
        // Automatically add branch context to responses
        if (Array.isArray(data)) {
          return data.map(item => ({ ...item, branchContext }));
        }
        return { ...data, branchContext };
      }),
    );
  }
}
```

### Implementation Steps

#### Phase 1: Core Infrastructure (Immediate)
1. Update Company Management entity schemas
2. Implement BranchContextMiddleware
3. Create MultiBranchService base class
4. Add branch decorators and guards
5. Update all existing endpoints

#### Phase 2: Automatic Migration (Day 1)
1. Script to add branch_id to all tables
2. Migrate existing data to default branches
3. Create branch_contexts entries
4. Update all microservices to use branch context

#### Phase 3: Integration (Day 2)
1. Update API Gateway for branch routing
2. Modify authentication to include branch claims
3. Update all frontend apps for branch context
4. Implement branch switching UI

#### Phase 4: Advanced Features (Day 3)
1. Cross-branch data sharing permissions
2. Branch-specific configurations
3. Branch performance analytics
4. Multi-branch reporting

### API Changes

#### All Endpoints Will Automatically:
```typescript
// Before: /api/products
// After: /api/products (with automatic branch filtering)

// Before: GET /api/orders
// After: GET /api/orders
// Automatically filtered by user's branch context

// New endpoints for branch management
GET    /api/branches/current
POST   /api/branches/switch/:branchId
GET    /api/branches/available
GET    /api/branches/:id/statistics
```

### Frontend Integration
```typescript
// Automatic branch context in all API calls
class BranchAwareApiClient {
  constructor(private branchContext: BranchContext) {}
  
  async get(url: string) {
    return fetch(url, {
      headers: {
        'X-Branch-ID': this.branchContext.currentBranchId,
        'Authorization': `Bearer ${this.token}`
      }
    });
  }
}
```

### Benefits
1. **Zero Configuration** - Works automatically everywhere
2. **Complete Isolation** - Branch data is completely separated
3. **Transparent** - Developers don't need to worry about branch filtering
4. **Scalable** - Easy to add new branches
5. **Secure** - Branch-level access control built-in

### Migration Strategy
1. Deploy updated Company Management service
2. Run migration scripts on all databases
3. Update all microservices with branch awareness
4. Deploy frontend updates
5. Enable branch switching for users

This architecture ensures multi-branch functionality is not an afterthought but a core feature that works automatically throughout the entire system.