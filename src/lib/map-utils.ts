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

export function compressRoute(res:tts.CalculateRouteResponse){
const routeGeoJSON = res.toGeoJson();
const dist = res.routes[0].summary.lengthInMeters;
const newLen = dist/100;
//Evenly  taking out indexes will probably distribute the route in 100m*;

const routeGeometry = routeGeoJSON.features[0].geometry.coordinates; // Adjust the path if needed
var points=<LatLng>[]


//Pick the points at choosed indexes

return points

}
