const normalize = (val) => {
  const s = (val || "").toString().trim().toUpperCase();
  return s.startsWith("ROLE_") ? s.slice(5) : s;
};

const useRBAC = (user, roles) => {
  if (!user) return false;
  const required = (roles || []).map(normalize);
  // Support user.role being string or object with name
  const userRole = user.role?.name ?? user.role ?? user?.authorRole ?? user?.roleName;
  return required.includes(normalize(userRole));
};

export default useRBAC;
