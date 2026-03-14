export const getLeadPermissions = (user) => {

  return {
    canCreateLead: user?.role === "admin" || user?.role === "manager",
    canDeleteLead: user?.role === "admin"
  };

};