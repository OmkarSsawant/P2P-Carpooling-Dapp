export  class PlaceFinder {
    

    async getNearbyPlaces(query, lat, long, limit = 5, radius = 20000) {
        let baseUrl = 'https://api.tomtom.com/search/2/poiSearch';
        let queryString = `limit=${limit}&lat=${lat}&lon=${long}&radius=${radius}&key=zDdTIbXIoZa6sN1Gqs2WJysenDpQ9Ild`;
        
        let response = await fetch(`${baseUrl}/${query}.json?${queryString}`);
        
        
        return (await response.json()).results;
    }
}