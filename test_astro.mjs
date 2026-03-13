import * as Astronomy from 'astronomy-engine';

try {
  const date = new Date(Date.UTC(2026, 5, 22, 9, 32, 18)); // June 22, 2026, 09:32:18 UTC

  const time = Astronomy.MakeTime(date);
  const observer = new Astronomy.Observer(0, 0, 0);
  
  // Equator arguments: body, date, observer, ofdate, topocentric
  const eq = Astronomy.Equator(Astronomy.Body.Sun, time, observer, true, false); 
  let dec = eq.dec; 
  let ra = eq.ra; // RA in hours
  let gst = Astronomy.SiderealTime(time); // GST in hours

  let gha = (gst - ra) * 15;
  while (gha < 0) gha += 360;
  while (gha >= 360) gha -= 360;

  const formatDegMin = (decDeg) => {
    const isNeg = decDeg < 0;
    const absDeg = Math.abs(decDeg);
    const d = Math.floor(absDeg);
    const m = (absDeg - d) * 60;
    return `${isNeg ? '-' : ''}${d}° ${m.toFixed(1)}'`;
  }
  
  console.log("Date:", date.toISOString());
  console.log("Formatted Dec:", formatDegMin(dec));
  console.log("Formatted GHA:", formatDegMin(gha));
} catch (e) {
  console.error(e);
}
