export default interface Configuration {
    email?: string;
    venue?: {
        name?: string;
        address?: string;
        coordinates?: {
            lat: number;
            lng: number;
        }
    }
}