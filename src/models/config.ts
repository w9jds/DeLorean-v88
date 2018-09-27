export default interface Configuration {
    email?: string;
    venue?: {
        url?: string;
        name?: string;
        address?: string;
        placeId?: string;
        pictureUrl?: string;
        coordinates?: {
            lat: number;
            lng: number;
        }
    };
    date?: {
        multiDay?: boolean;
        startDate?: string;
        endDate?: string;
    };
}