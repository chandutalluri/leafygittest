import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { db } from '../database/connection';
import { companies, branches } from '../entities/company-management.entity';
import {
  CreateCompanyDto,
  UpdateCompanyDto,
  CreateBranchDto,
  UpdateBranchDto,
} from '../dto/company-management.dto';

@Injectable()
export class CompanyManagementService {
  // Company Operations
  async createCompany(createCompanyDto: CreateCompanyDto) {
    try {
      const [company] = await db
        .insert(companies)
        .values({
          name: createCompanyDto.name,
          slug: createCompanyDto.name.toLowerCase().replace(/\s+/g, '-'),
          description: createCompanyDto.description,
          logo: createCompanyDto.logoUrl,
          website: createCompanyDto.website,
          email: createCompanyDto.email,
          phone: createCompanyDto.phone,
          address: createCompanyDto.address,
          city: createCompanyDto.city,
          state: createCompanyDto.state,
          country: createCompanyDto.country,
          postal_code: createCompanyDto.postalCode,
          tax_id: createCompanyDto.panNumber,
          registration_number: createCompanyDto.cinNumber,
          fssai_license: createCompanyDto.fssaiLicense,
          gst_number: createCompanyDto.gstNumber,
          industry: createCompanyDto.businessCategory,
          founded_year: createCompanyDto.establishmentYear,
          is_active: createCompanyDto.isActive ?? true,
        })
        .returning();
      
      return company;
    } catch (error) {
      throw new BadRequestException('Failed to create company');
    }
  }

  async getAllCompanies() {
    return await db.select().from(companies).where(eq(companies.is_active, true));
  }

  async getCompanyById(id: string) {
    const companyId = parseInt(id, 10);
    if (isNaN(companyId)) {
      throw new BadRequestException('Invalid company ID');
    }
    
    const company = await db
      .select()
      .from(companies)
      .where(and(eq(companies.id, companyId), eq(companies.is_active, true)))
      .limit(1);

    if (!company.length) {
      throw new NotFoundException('Company not found');
    }

    return company[0];
  }

  async updateCompany(id: string, updateCompanyDto: UpdateCompanyDto) {
    try {
      const updateData: any = {};
      
      if (updateCompanyDto.name !== undefined) updateData.name = updateCompanyDto.name;
      if (updateCompanyDto.description !== undefined) updateData.description = updateCompanyDto.description;
      if (updateCompanyDto.website !== undefined) updateData.website = updateCompanyDto.website;
      if (updateCompanyDto.email !== undefined) updateData.email = updateCompanyDto.email;
      if (updateCompanyDto.phone !== undefined) updateData.phone = updateCompanyDto.phone;
      if (updateCompanyDto.address !== undefined) updateData.address = updateCompanyDto.address;
      if (updateCompanyDto.logoUrl !== undefined) updateData.logoUrl = updateCompanyDto.logoUrl;
      if (updateCompanyDto.primaryColor !== undefined) updateData.primaryColor = updateCompanyDto.primaryColor;
      if (updateCompanyDto.secondaryColor !== undefined) updateData.secondaryColor = updateCompanyDto.secondaryColor;
      if (updateCompanyDto.accentColor !== undefined) updateData.accentColor = updateCompanyDto.accentColor;
      if (updateCompanyDto.gstNumber !== undefined) updateData.gstNumber = updateCompanyDto.gstNumber;
      if (updateCompanyDto.fssaiLicense !== undefined) updateData.fssaiLicense = updateCompanyDto.fssaiLicense;
      if (updateCompanyDto.panNumber !== undefined) updateData.panNumber = updateCompanyDto.panNumber;
      if (updateCompanyDto.cinNumber !== undefined) updateData.cinNumber = updateCompanyDto.cinNumber;
      if (updateCompanyDto.msmeRegistration !== undefined) updateData.msmeRegistration = updateCompanyDto.msmeRegistration;
      if (updateCompanyDto.tradeLicense !== undefined) updateData.tradeLicense = updateCompanyDto.tradeLicense;
      if (updateCompanyDto.establishmentYear !== undefined) updateData.establishmentYear = updateCompanyDto.establishmentYear;
      if (updateCompanyDto.businessCategory !== undefined) updateData.businessCategory = updateCompanyDto.businessCategory;
      if (updateCompanyDto.isActive !== undefined) updateData.isActive = updateCompanyDto.isActive;
      
      updateData.updatedAt = new Date();

      const [updatedCompany] = await db
        .update(companies)
        .set(updateData)
        .where(eq(companies.id, parseInt(id)))
        .returning();

      if (!updatedCompany) {
        throw new NotFoundException('Company not found');
      }

      return updatedCompany;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update company');
    }
  }

  async deleteCompany(id: string) {
    try {
      const [deletedCompany] = await db
        .update(companies)
        .set({ is_active: false, updated_at: new Date() })
        .where(eq(companies.id, parseInt(id)))
        .returning();

      if (!deletedCompany) {
        throw new NotFoundException('Company not found');
      }

      return { message: 'Company deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete company');
    }
  }

  // Branch Operations
  async createBranch(createBranchDto: CreateBranchDto) {
    try {
      // Verify company exists
      await this.getCompanyById(createBranchDto.companyId);

      const [branch] = await db
        .insert(branches)
        .values({
          company_id: parseInt(createBranchDto.companyId),
          name: createBranchDto.name,
          code: createBranchDto.code || `BR${Date.now()}`,
          address: createBranchDto.address,
          city: createBranchDto.city || '',
          state: createBranchDto.state || '',
          country: createBranchDto.country || 'India',
          postal_code: createBranchDto.postalCode,
          latitude: createBranchDto.latitude?.toString(),
          longitude: createBranchDto.longitude?.toString(),
          phone: createBranchDto.phone,
          email: createBranchDto.email,
          manager_name: createBranchDto.managerName,
          operating_hours: createBranchDto.operatingHours,
          delivery_radius: createBranchDto.deliveryRadius || null,
          settings: createBranchDto.settings || {},
          is_active: createBranchDto.isActive ?? true,
        })
        .returning();
      
      return branch;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to create branch');
    }
  }

  async getAllBranches() {
    return await db.select().from(branches).where(eq(branches.is_active, true));
  }

  async getBranchesByCompany(companyId: string) {
    return await db
      .select()
      .from(branches)
      .where(and(eq(branches.company_id, parseInt(companyId)), eq(branches.is_active, true)));
  }

  async getBranchById(id: string) {
    const branch = await db
      .select()
      .from(branches)
      .where(and(eq(branches.id, parseInt(id)), eq(branches.is_active, true)))
      .limit(1);

    if (!branch.length) {
      throw new NotFoundException('Branch not found');
    }

    return branch[0];
  }

  async updateBranch(id: string, updateBranchDto: UpdateBranchDto) {
    try {
      const updateData: any = {};
      
      if (updateBranchDto.name !== undefined) updateData.name = updateBranchDto.name;
      if (updateBranchDto.address !== undefined) updateData.address = updateBranchDto.address;
      if (updateBranchDto.latitude !== undefined) updateData.latitude = updateBranchDto.latitude?.toString();
      if (updateBranchDto.longitude !== undefined) updateData.longitude = updateBranchDto.longitude?.toString();
      if (updateBranchDto.language !== undefined) updateData.language = updateBranchDto.language;
      if (updateBranchDto.phone !== undefined) updateData.phone = updateBranchDto.phone;
      if (updateBranchDto.whatsappNumber !== undefined) updateData.whatsappNumber = updateBranchDto.whatsappNumber;
      if (updateBranchDto.email !== undefined) updateData.email = updateBranchDto.email;
      if (updateBranchDto.managerName !== undefined) updateData.managerName = updateBranchDto.managerName;
      if (updateBranchDto.operatingHours !== undefined) updateData.operatingHours = updateBranchDto.operatingHours;
      if (updateBranchDto.isActive !== undefined) updateData.isActive = updateBranchDto.isActive;
      
      updateData.updatedAt = new Date();

      const [updatedBranch] = await db
        .update(branches)
        .set(updateData)
        .where(eq(branches.id, parseInt(id)))
        .returning();

      if (!updatedBranch) {
        throw new NotFoundException('Branch not found');
      }

      return updatedBranch;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update branch');
    }
  }

  async deleteBranch(id: string) {
    try {
      const [deletedBranch] = await db
        .update(branches)
        .set({ is_active: false, updated_at: new Date() })
        .where(eq(branches.id, parseInt(id)))
        .returning();

      if (!deletedBranch) {
        throw new NotFoundException('Branch not found');
      }

      return { message: 'Branch deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete branch');
    }
  }

  // Company Hierarchy
  async getCompanyHierarchy(companyId: string) {
    const company = await this.getCompanyById(companyId);
    const branches = await this.getBranchesByCompany(companyId);

    return {
      company,
      branches,
      totalBranches: branches.length,
    };
  }
}