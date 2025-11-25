const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');

class AdminController {
  async getAllUsers(req, res, next) {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('id, email, role, full_name, department, is_active, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const { email, password, role, full_name, department } = req.body;

      const passwordHash = await bcrypt.hash(password, 10);

      const { data: user, error } = await supabase
        .from('users')
        .insert([{
          email,
          password_hash: passwordHash,
          role,
          full_name,
          department: role === 'department' ? department : null
        }])
        .select('id, email, role, full_name, department, is_active, created_at')
        .single();

      if (error) throw error;

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { email, role, full_name, department, is_active } = req.body;

      const updateData = {
        email,
        role,
        full_name,
        department: role === 'department' ? department : null,
        is_active
      };

      const { data: user, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select('id, email, role, full_name, department, is_active, created_at')
        .single();

      if (error) throw error;

      res.json({
        success: true,
        message: 'User updated successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      if (id === req.user.id) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete your own account'
        });
      }

      // Check if user is admin
      const { data: userToDelete } = await supabase
        .from('users')
        .select('role')
        .eq('id', id)
        .single();

      if (userToDelete && userToDelete.role === 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Cannot delete admin users'
        });
      }

      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async changeUserPassword(req, res, next) {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;

      if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters'
        });
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);

      const { error } = await supabase
        .from('users')
        .update({ password_hash: passwordHash })
        .eq('id', id);

      if (error) throw error;

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async getAuditLogs(req, res, next) {
    try {
      const { data: logs, error } = await supabase
        .from('audit_logs')
        .select(`
          *,
          users:user_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      res.json({
        success: true,
        count: logs.length,
        data: logs
      });
    } catch (error) {
      next(error);
    }
  }

  async getDashboardStats(req, res, next) {
    try {
      const { data: partnerships } = await supabase
        .from('partnerships')
        .select('status, department, expiration_date');

      const { data: users } = await supabase
        .from('users')
        .select('role, is_active');

      const now = new Date();
      const expiringPartners = partnerships.filter(p => {
        const expDate = new Date(p.expiration_date);
        const daysUntilExpiry = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
      });

      const stats = {
        partnerships: {
          total: partnerships.length,
          active: partnerships.filter(p => p.status === 'active').length,
          for_renewal: partnerships.filter(p => p.status === 'for_renewal').length,
          terminated: partnerships.filter(p => p.status === 'terminated').length,
          expiring_soon: expiringPartners.length
        },
        users: {
          total: users.length,
          active: users.filter(u => u.is_active).length,
          admin: users.filter(u => u.role === 'admin').length,
          department: users.filter(u => u.role === 'department').length,
          viewer: users.filter(u => u.role === 'viewer').length
        },
        by_department: {}
      };

      ['STE', 'CET', 'CCJE', 'HuSoCom', 'BSMT', 'SBME', 'CHATME'].forEach(dept => {
        stats.by_department[dept] = partnerships.filter(p => p.department === dept).length;
      });

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();