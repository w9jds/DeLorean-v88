export default interface Configuration {
    org?: Organization;
    venue?: Venue;
    event?: Event;
}

interface Organization {
    name?: any;
    email?: any;
    facebook?: any;
    twitter?: any;
    github?: any;
    meetup?: any;
}

interface Venue {
    url?: any;
    name?: any;
    address?: any;
    placeId?: any;
    pictureUrl?: any;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

interface Event {
    multiDay?: boolean;
    startDate?: any;
    endDate?: any;
    papercall?: PaperCall;
    sponsors?: any;
}

interface PaperCall {
    url?: any;
    closing?: Date;
}