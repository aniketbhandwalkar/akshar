// Returns clinician details from environment configuration
// Expected env vars:
// CLINICIAN_NAME, CLINICIAN_SPECIALIZATION, CLINICIAN_ADDRESS, CLINICIAN_PHONE, CLINICIAN_EMAIL

const getClinician = () => {
  const name = process.env.CLINICIAN_NAME;
  if (!name) return null;

  return {
    name,
    specialization: process.env.CLINICIAN_SPECIALIZATION || '',
    address: process.env.CLINICIAN_ADDRESS || '',
    phone: process.env.CLINICIAN_PHONE || '',
    email: process.env.CLINICIAN_EMAIL || ''
  };
};

module.exports = { getClinician };
