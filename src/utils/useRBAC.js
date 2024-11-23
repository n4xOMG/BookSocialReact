const useRBAC = (user, roles) => {
  if (!user) return false;
  return roles.includes(user.role.name);
};

export default useRBAC;
