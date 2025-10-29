
// Function to convert degrees to radians
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Function to convert radians to degrees
function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

// Calculate bearing between two points
export function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const lat1Rad = toRadians(lat1);
  const lon1Rad = toRadians(lon1);
  const lat2Rad = toRadians(lat2);
  const lon2Rad = toRadians(lon2);

  const y = Math.sin(lon2Rad - lon1Rad) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(lon2Rad - lon1Rad);
  
  const bearingRad = Math.atan2(y, x);
  const bearingDeg = toDegrees(bearingRad);

  // Normalize to 0-360
  return (bearingDeg + 360) % 360;
}
