import { MakeTime, Observer, Equator, SiderealTime, Body, GeoVector, Ecliptic } from 'astronomy-engine';

/**
 * Normalizes an angle to 0-360 degrees
 */
export function normalizeAngle(angle) {
  let a = angle % 360;
  if (a < 0) a += 360;
  return a;
}

/**
 * Calculates Dec and GHA for a given body and UTC Date.
 */
export function getAstroData(bodyName, utcDate) {
  let body;
  switch (bodyName.toLowerCase()) {
    case 'sun': body = Body.Sun; break;
    case 'moon': body = Body.Moon; break;
    case 'venus': body = Body.Venus; break;
    case 'mars': body = Body.Mars; break;
    case 'jupiter': body = Body.Jupiter; break;
    case 'saturn': body = Body.Saturn; break;
    default: body = Body.Star; // Placeholder for Stars if needed, but astronomy engine handles stars differently.
  }

  const time = MakeTime(utcDate);
  const observer = new Observer(0, 0, 0);
  
  // Apparent geocentric coordinates
  const eq = Equator(body, time, observer, true, false); 
  
  const dec = eq.dec; 
  const ra = eq.ra; // RA in hours
  const gst = SiderealTime(time); // GST in hours

  const gha = normalizeAngle((gst - ra) * 15);

  let hp = 0;
  let sd = 0;

  // Simplistic HP and SD estimation.
  // For precise Moon HP and SD, you'd calculate geocentric distance.
  if (body === Body.Moon) {
    // Very rough approx. Real implementation would calculate from distance.
    const vector = GeoVector(body, time, true);
    // Distance in AU
    const distAU = Math.sqrt(vector.x*vector.x + vector.y*vector.y + vector.z*vector.z);
    // 1 AU = 149597870.7 km. Earth radius = 6378.14 km. 
    // sin(HP) = earth_radius / distance
    hp = Math.asin(6378.14 / (distAU * 149597870.7)) * (180/Math.PI) * 60; // in minutes
    sd = 0.2724 * hp; // Moon SD is roughly 0.2724 * HP
  } else if (body === Body.Sun) {
    const vector = GeoVector(body, time, true);
    const distAU = Math.sqrt(vector.x*vector.x + vector.y*vector.y + vector.z*vector.z);
    sd = 16.0 / distAU; // varies ~15.8 to 16.3
    hp = 0.15 / distAU; 
  }

  return { dec, gha, hp, sd };
}
