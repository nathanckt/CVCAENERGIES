'use strict';

/**
 * references service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::references.references');
