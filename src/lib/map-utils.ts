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
  points.push(pe);
}

return points

}
