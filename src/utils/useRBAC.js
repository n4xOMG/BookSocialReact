const useRBAC = (user, roles) => {
  if (!user || !Array.isArray(roles) || roles.length === 0) {
    return false;
  }

  const normalize = (value) => {
    if (!value) return null;
    const upper = value.trim().toUpperCase();
    return upper.startsWith("ROLE_") ? upper.slice(5) : upper;
  };

  const userRole = normalize(user.role?.name || "");
  if (!userRole) return false;

  return roles.some((role) => normalize(role) === userRole);
};

export default useRBAC;
