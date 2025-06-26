export interface EventModel {
    _id?: string;  // MongoDB ID (optional for new events)
    title: string;
    date: Date;
    startTime: string;
    endTime: string;
    location: string;
    description: string;
    category: string;
    status?: string;  // Event status (active, inactive, cancelled, etc.)
    creator?: string;  // User ID who created the event
    imagePath?: string;
}





