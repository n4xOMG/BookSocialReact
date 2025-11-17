const COLOR_PALETTE = ["#DC2626", "#D97706", "#059669", "#2563EB", "#0EA5E9", "#7C3AED", "#DB2777", "#F59E0B", "#14B8A6"];

const sanitizeString = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  const str = String(value).trim();
  return str;
};

export const generateConsistentColor = (seed) => {
  const sanitizedSeed = sanitizeString(seed);
  const finalSeed = sanitizedSeed.length ? sanitizedSeed : "guest";

  let hash = 0;
  for (let index = 0; index < finalSeed.length; index += 1) {
    hash = finalSeed.charCodeAt(index) + ((hash << 5) - hash);
  }

  const paletteIndex = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[paletteIndex];
};

export const buildPresenceUser = (user) => {
  const nameCandidates = [user?.fullname, user?.username, user?.name, user?.email, "Anonymous"];
  const name = nameCandidates.map(sanitizeString).find((candidate) => candidate.length > 0) || "Anonymous";

  const seedCandidates = [user?.id, user?.username, user?.email, name];
  const colorSeed = seedCandidates.map(sanitizeString).find((candidate) => candidate.length > 0) || name;

  return {
    id: user?.id ?? null,
    name,
    color: generateConsistentColor(colorSeed),
  };
};
