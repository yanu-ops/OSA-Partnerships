const partnershipService = require('../services/partnership.service');

class PartnershipController {
  async create(req, res, next) {
    try {
      const partnership = await partnershipService.createPartnership(
        req.body,
        req.user.id
      );
      res.status(201).json({
        success: true,
        message: 'Partnership created successfully',
        data: partnership
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const filters = {
        department: req.query.department,
        status: req.query.status,
        school_year: req.query.school_year,
        search: req.query.search
      };

      const partnerships = await partnershipService.getPartnerships(
        filters,
        req.user.role,
        req.user.department
      );

      res.json({
        success: true,
        count: partnerships.length,
        data: partnerships
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const partnership = await partnershipService.getPartnershipById(
        req.params.id,
        req.user.role,
        req.user.department
      );
      res.json({
        success: true,
        data: partnership
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const partnership = await partnershipService.updatePartnership(
        req.params.id,
        req.body,
        req.user.id,
        req.user.role,
        req.user.department
      );
      res.json({
        success: true,
        message: 'Partnership updated successfully',
        data: partnership
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await partnershipService.deletePartnership(
        req.params.id,
        req.user.id,
        req.user.role,
        req.user.department
      );
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  async getStatistics(req, res, next) {
    try {
      const stats = await partnershipService.getStatistics(
        req.user.role,
        req.user.department
      );
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PartnershipController();