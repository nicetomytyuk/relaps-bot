export interface Event {
    title?: string;
    description?: string | null;
    photoId?: string | null;
    date?: string;
    startTime?: string;
    meetingPoint?: string;
    difficultyLevel?: string;
    duration?: string;
    totalDistance?: string;
    equipment?: string[];
    itinerary?: string;
}