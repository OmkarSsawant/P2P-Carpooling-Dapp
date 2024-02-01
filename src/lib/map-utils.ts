import tts, { LatLng } from '@tomtom-international/web-sdk-services'

export function splitLine(
    start:tts.LatLng,end:tts.LatLng,  count:number) {
  count = count + 1;

  let d = Math.sqrt((start.lat! - end.lat!) * (start.lat! - end.lat!) +
          (start.lng! - end.lng!) * (start.lng! - end.lng!)) /
      count;
  let  fi = Math.atan2(end.lng! - start.lng!, end.lat! - start.lat!);

  var points = [];

  for (var i = 0; i <= count; ++i)
    points.push({"lat":start.lat! + i * d * Math.cos(fi),"lon": start.lng! + i * d * Math.sin(fi)});

  return points;
}

export function compressRoute(res:tts.CalculateRouteResponse,km=1){
// const routeGeoJSON = res.toGeoJson();
const dist = res.routes[0].summary.lengthInMeters;
// const routeGeometry = routeGeoJSON.features[0].geometry.coordinates; // Adjust the path if needed
//Evenly  taking out indexes will probably distribute the route in 100m*;
const routeGeometry = res.routes[0].legs[0].points;
console.log(routeGeometry.length);

const  secs = Math.round( (dist/1000)) ; //1KM 
console.log("secs",secs);

const newLen = Math.min(secs,routeGeometry.length);
console.log("newLen",newLen);

const skip =  Math.round(routeGeometry.length/newLen);
console.log("skip",skip);

const points=[]

//Pick the points at choosed indexes
for (let i = 0; i < routeGeometry.length; i+=skip) {
  const mid = Math.round((i+(i+skip-1))/2);
  const pe = routeGeometry[ mid];
  if(pe!=undefined)
  points.push({"latitude":pe.lat,"longitude":pe.lng});
}

return points

}

export function getDistanceFromLatLonInKm(point1, point2) {
  function convertDegToRad(value:number) { return value * Math.PI / 180 }
  const [lat1, lon1] = point1;
  const [lat2, lon2] = point2;
  const earthRadius = 6371;
  const dLat = convertDegToRad(lat2 - lat1);
  const dLon = convertDegToRad(lon2 - lon1);
  const squarehalfChordLength =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(convertDegToRad(lat1)) * Math.cos(convertDegToRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const angularDistance = 2 * Math.atan2(Math.sqrt(squarehalfChordLength), Math.sqrt(1 - squarehalfChordLength));
  const distance = earthRadius * angularDistance;
  return distance;

}
export function inRange(l1:any,l2:any,km:number){
  const dist = getDistanceFromLatLonInKm([l1.latitude,l1.longitude],[l2.latitude,l2.longitude])
  return dist <= km;
}
