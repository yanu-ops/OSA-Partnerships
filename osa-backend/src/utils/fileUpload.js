// osa-backend/src/utils/fileUpload.js

const supabase = require('../config/supabase');
const path = require('path');

/**
 * Upload image to Supabase Storage
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} originalName - Original filename
 * @param {string} folder - Folder name in bucket
 * @returns {Promise<string>} - Public URL of uploaded file
 */
const uploadImage = async (fileBuffer, originalName, folder = 'partnerships') => {
  try {
    // Generate unique filename
    const fileExt = path.extname(originalName);
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('partnership-images')
      .upload(fileName, fileBuffer, {
        contentType: `image/${fileExt.substring(1)}`,
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload image');
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('partnership-images')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    throw error;
  }
};

/**
 * Delete image from Supabase Storage
 * @param {string} imageUrl - Public URL of the image
 * @returns {Promise<boolean>} - Success status
 */
const deleteImage = async (imageUrl) => {
  try {
    if (!imageUrl) return true;

    // Extract file path from URL
    const urlParts = imageUrl.split('/partnership-images/');
    if (urlParts.length < 2) return true;
    
    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from('partnership-images')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteImage:', error);
    return false;
  }
};

module.exports = {
  uploadImage,
  deleteImage
};