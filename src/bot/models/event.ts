export interface Event {
    title?: string;
    description?: string | null;
    photoId?: string | null;
    date?: string;
    startTime?: string;
    meetingPointUrl?: string;
    difficultyLevel?: string;
    duration?: string;
    totalDistance?: string;
    equipment?: string[];
    itineraryUrl?: string;
    invitation?: string | null;
}