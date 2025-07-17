/**
 * Port Configuration for LeafyHealth Microservices
 * IMPORTS FROM MASTER CONFIGURATION - NO CONFLICTS
 */

const masterConfig = require('./master-port-config');

// Use master configuration - single source of truth
const FRONTEND_PORTS = masterConfig.FRONTEND_PORTS;
const SERVICE_PORTS = masterConfig.SERVICE_PORTS;

// Use master configuration functions
const getFrontendPort = masterConfig.getFrontendPort;
const getBackendPort = masterConfig.getBackendPort;
const getAllServices = masterConfig.getAllServices;
const getServiceByPort = masterConfig.getServiceByPort;

module.exports = {
  getFrontendPort,
  getBackendPort,
  getAllServices,
  getServiceByPort,
  FRONTEND_PORTS,
  SERVICE_PORTS
};