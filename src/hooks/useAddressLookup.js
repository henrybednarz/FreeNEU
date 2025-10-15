export async function getAddressFromCoordinates(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const address = data['address'] || {};
        const addressString = [
            address['building'] || '',
            address['house_number'],
            address['road']
        ].filter(Boolean).join(" ");
        return addressString || "Unknown address";
    } catch (error) {
        console.error("Error fetching address:", error);
        return "Could not fetch address.";
    }
}