# Frontend Cleanup and Optimization Plan

## Issues to Fix

### 1. Duplicate Store Implementations
**Web App**: Has both `cart.ts` and `useCartStore.ts`, `auth.ts` and `useAuthStore.ts`
**Mobile App**: Different structure with stores in different directories

### 2. Duplicate Auth Hooks
Multiple `useAuth` implementations across apps:
- `src/hooks/useAuth.ts` 
- `src/lib/hooks/useAuth.ts`
- Context-based implementations in providers

### 3. TypeScript/ESLint Errors
Multiple linting issues in ecommerce-web

### 4. Image Management Service TypeScript Error
Compilation error preventing service from starting properly

## Solution Approach

1. **Standardize Store Pattern**
   - Use consistent Zustand store pattern across all apps
   - Remove duplicate implementations
   - Use `use[Name]Store.ts` naming convention

2. **Unify Auth Implementation**
   - Create single auth hook using Zustand store
   - Remove duplicate useAuth implementations
   - Ensure consistent JWT handling

3. **Fix TypeScript Errors**
   - Run prettier on all frontend apps
   - Fix Image Management service compilation

4. **Create Shared Libraries**
   - Move common stores/hooks to shared package
   - Reduce code duplication across apps