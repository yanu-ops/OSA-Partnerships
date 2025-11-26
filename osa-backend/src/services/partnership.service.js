const supabase = require('../config/supabase');
const { NotFoundError, ForbiddenError } = require('../utils/errors');
const { calculateSchoolYear, sanitizePartnershipData } = require('../utils/helpers');

class PartnershipService {
  async createPartnership(partnershipData, userId) {
    const schoolYear = calculateSchoolYear(new Date(partnershipData.date_established));

    const { data, error } = await supabase
      .from('partnerships')
      .insert([{
        ...partnershipData,
        school_year: schoolYear,
        created_by: userId
      }])
      .select()
      .single();

    if (error) {
      throw new Error('Failed to create partnership');
    }

    await this.logAudit(userId, 'CREATE', 'partnerships', data.id, null, data);

    return data;
  }

  async getPartnerships(filters = {}, userRole, userDepartment) {
    let query = supabase.from('partnerships').select('*');

    if (filters.department) {
      query = query.eq('department', filters.department);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.school_year) {
      query = query.eq('school_year', filters.school_year);
    }

    if (filters.search) {
      query = query.or(`business_name.ilike.%${filters.search}%,contact_person.ilike.%${filters.search}%`);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      throw new Error('Failed to fetch partnerships');
    }

    // Sanitize data based on user role and department
    const sanitized = data.map(p => {
      // Viewer: limited access to all partnerships
      if (userRole === 'viewer') {
        return this.sanitizeLimitedAccess(p);
      }
      
      // Department: full access to own, limited to others
      if (userRole === 'department') {
        if (p.department === userDepartment) {
          return p; // Full access to own department
        } else {
          return this.sanitizeLimitedAccess(p); // Limited access to other departments
        }
      }
      
      // Admin: full access to everything
      return p;
    });

    return sanitized;
  }

  async getPartnershipById(id, userRole, userDepartment) {
    const { data, error } = await supabase
      .from('partnerships')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundError('Partnership not found');
    }

    // Apply access control
    if (userRole === 'viewer') {
      return this.sanitizeLimitedAccess(data);
    }

    if (userRole === 'department') {
      if (data.department === userDepartment) {
        return data; // Full access to own department
      } else {
        return this.sanitizeLimitedAccess(data); // Limited access to other departments
      }
    }

    // Admin gets full access
    return data;
  }

  async updatePartnership(id, updateData, userId, userRole, userDepartment) {
    const { data: existing } = await supabase
      .from('partnerships')
      .select('*')
      .eq('id', id)
      .single();

    if (!existing) {
      throw new NotFoundError('Partnership not found');
    }

    if (userRole === 'department' && existing.department !== userDepartment) {
      throw new ForbiddenError('Cannot update partnerships from other departments');
    }

    const { data, error } = await supabase
      .from('partnerships')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error('Failed to update partnership');
    }

    await this.logAudit(userId, 'UPDATE', 'partnerships', id, existing, data);

    return data;
  }

  async deletePartnership(id, userId, userRole, userDepartment) {
    const { data: existing } = await supabase
      .from('partnerships')
      .select('*')
      .eq('id', id)
      .single();

    if (!existing) {
      throw new NotFoundError('Partnership not found');
    }

    if (userRole === 'department' && existing.department !== userDepartment) {
      throw new ForbiddenError('Cannot delete partnerships from other departments');
    }

    const { error } = await supabase
      .from('partnerships')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error('Failed to delete partnership');
    }

    await this.logAudit(userId, 'DELETE', 'partnerships', id, existing, null);

    return { message: 'Partnership deleted successfully' };
  }

  async getStatistics(userRole, userDepartment) {
    let query = supabase.from('partnerships').select('status, department');

    if (userRole === 'department') {
      query = query.eq('department', userDepartment);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error('Failed to fetch statistics');
    }

    const stats = {
      total: data.length,
      active: data.filter(p => p.status === 'active').length,
      terminated: data.filter(p => p.status === 'terminated').length,
      for_renewal: data.filter(p => p.status === 'for_renewal').length,
      non_renewal: data.filter(p => p.status === 'non_renewal').length,
      by_department: {}
    };

    ['STE', 'CET', 'CCJE', 'HuSoCom', 'BSMT', 'SBME', 'CHATME'].forEach(dept => {
      stats.by_department[dept] = data.filter(p => p.department === dept).length;
    });

    return stats;
  }

  // Sanitize partnership data for limited access (viewers and other departments)
  sanitizeLimitedAccess(partnership) {
    return {
      id: partnership.id,
      business_name: partnership.business_name,
      department: partnership.department,
      date_established: partnership.date_established,
      expiration_date: partnership.expiration_date,
      school_year: partnership.school_year,
      status: partnership.status,
      image_url: partnership.image_url, // Include image for limited access
      // Exclude sensitive information
      // address: hidden
      // contact_person: hidden
      // manager_supervisor_1: hidden
      // manager_supervisor_2: hidden
      // email: hidden
      // contact_number: hidden
      // remarks: hidden
      // created_at: hidden
      // created_by: hidden
    };
  }

  async logAudit(userId, action, tableName, recordId, oldValues, newValues) {
    await supabase.from('audit_logs').insert([{
      user_id: userId,
      action,
      table_name: tableName,
      record_id: recordId,
      old_values: oldValues,
      new_values: newValues
    }]);
  }
}

module.exports = new PartnershipService();