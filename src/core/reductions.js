/**
 * Core mathematical functions for Sight Reduction.
 * Formulas are based on the manual calculations.
 */

export function degToRad(deg) { return deg * Math.PI / 180; }
export function radToDeg(rad) { return rad * Math.PI / 180; }

export function calculateSightReduction({ lat, lon, dec, gha }) {
  // LHA
  let lha = gha + lon;
  while (lha < 0) lha += 360;
  while (lha >= 360) lha -= 360;

  const latRad = degToRad(lat);
  const decRad = degToRad(dec);
  const lhaRad = degToRad(lha);

  // Hc: sin(Hc) = sin(Lat) * sin(Dec) + cos(Lat) * cos(Dec) * cos(LHA)
  const sinHc = Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(lhaRad);
  const hcRad = Math.asin(sinHc);
  const hc = radToDeg(hcRad);

  // Azimuth Z: cos(Z) = [sin(Dec) - sin(Lat) * sin(Hc)] / [cos(Lat) * cos(Hc)]
  let cosZ = (Math.sin(decRad) - Math.sin(latRad) * sinHc) / (Math.cos(latRad) * Math.cos(hcRad));
  // Clamp due to precision
  if (cosZ > 1) cosZ = 1;
  if (cosZ < -1) cosZ = -1;
  
  const zRad = Math.acos(cosZ);
  let Z = radToDeg(zRad);

  // True Azimuth Zn
  let zn = 0;
  if (lat >= 0) { // Northern Hemisphere
    if (lha > 180) zn = Z;
    else zn = 360 - Z;
  } else { // Southern Hemisphere
    if (lha > 180) zn = 180 - Z;
    else zn = 180 + Z;
  }

  return { hc, zn, lha };
}

export function formatAngle(decimalDegrees) {
  const isNeg = decimalDegrees < 0;
  const absDeg = Math.abs(decimalDegrees);
  const d = Math.floor(absDeg);
  const m = (absDeg - d) * 60;
  return `${isNeg ? '-' : ''}${d}° ${m.toFixed(1)}'`;
}

export function parseHs(degrees, minutes, isNegative = false) {
  const val = Number(degrees) + (Number(minutes) / 60);
  return isNegative ? -val : val;
}

export function calculateDip(eyeHeightMeters) {
  return -1.77 * Math.sqrt(Math.max(0, parseFloat(eyeHeightMeters) || 0)); // in arcminutes
}

export function calculateRefraction(altDeg) {
  // Approximate refraction formula (in arcminutes)
  if (altDeg <= 0) return 0;
  return -1.0 / Math.tan(degToRad(altDeg + 7.31/(altDeg + 4.4)));
}

export function calculateSunHo(hsDeg, ieMin, dipMin, sdMin, isLowerLimb) {
  // hsDeg is decimal degrees
  const ha = hsDeg + (ieMin / 60) + (dipMin / 60);
  const refrMin = calculateRefraction(ha);
  const paMin = 0.15 * Math.cos(degToRad(ha)); // Parallax
  const sdSign = isLowerLimb ? 1 : -1;
  const ho = ha + (refrMin / 60) + (paMin / 60) + (sdSign * sdMin / 60);
  return ho;
}

export function calculateMoonHo(hsDeg, ieMin, dipMin, hpMin, sdMin, isLowerLimb) {
  const ha = hsDeg + (ieMin / 60) + (dipMin / 60);
  const refrMin = calculateRefraction(ha);
  const paMin = hpMin * Math.cos(degToRad(ha));
  const sdSign = isLowerLimb ? 1 : -1;
  const ho = ha + (refrMin / 60) + (paMin / 60) + (sdSign * sdMin / 60);
  return ho;
}

export function calculateStarHo(hsDeg, ieMin, dipMin) {
  const ha = hsDeg + (ieMin / 60) + (dipMin / 60);
  const refrMin = calculateRefraction(ha);
  return ha + (refrMin / 60);
}
