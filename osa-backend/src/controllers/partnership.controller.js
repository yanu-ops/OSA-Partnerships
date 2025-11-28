const partnershipService = require('../services/partnership.service');
const { uploadImage, deleteImage } = require('../utils/fileUpload');

class PartnershipController {
  async create(req, res, next) {
    try {
      let imageUrl = null;

      if (req.file) {
        imageUrl = await uploadImage(req.file.buffer, req.file.originalname);
      }

      const partnershipData = {
        ...req.body,
        image_url: imageUrl
      };

      const partnership = await partnershipService.createPartnership(
        partnershipData,
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
      let imageUrl = req.body.image_url; 

 
      if (req.file) {
  
        const oldPartnership = await partnershipService.getPartnershipById(
          req.params.id,
          req.user.role,
          req.user.department
        );


        imageUrl = await uploadImage(req.file.buffer, req.file.originalname);

  
        if (oldPartnership.image_url) {
          await deleteImage(oldPartnership.image_url);
        }
      }

      const partnershipData = {
        ...req.body,
        image_url: imageUrl
      };

      const partnership = await partnershipService.updatePartnership(
        req.params.id,
        partnershipData,
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

      const partnership = await partnershipService.getPartnershipById(
        req.params.id,
        req.user.role,
        req.user.department
      );

      const result = await partnershipService.deletePartnership(
        req.params.id,
        req.user.id,
        req.user.role,
        req.user.department
      );


      if (partnership.image_url) {
        await deleteImage(partnership.image_url);
      }

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