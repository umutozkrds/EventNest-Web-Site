import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventModel } from '../models/event.model';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class EventsService {
    private apiUrl = 'http://localhost:3000/api';

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    createEvent(event: EventModel, image: File): Observable<any> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const formData = new FormData();
        formData.append('title', event.title);
        formData.append('date', event.date.toISOString());
        formData.append('startTime', event.startTime);
        formData.append('endTime', event.endTime);
        formData.append('location', event.location);
        formData.append('description', event.description);
        formData.append('category', event.category);
        formData.append('image', image, image.name);

        return this.http.post(`${this.apiUrl}/events`, formData, { headers });
    }

    getEvents(): Observable<EventModel[]> {
        return this.http.get<{ message: string, events: any[] }>(`${this.apiUrl}/events`).pipe(
            map((response) => {
                return response.events.map(event => {
                    return {
                        ...event,
                        date: new Date(event.date) // Convert string date to Date object
                    };
                });
            })
        );
    }

    getEvent(id: string): Observable<EventModel> {
        return this.http.get<{ message: string, event: any }>(`${this.apiUrl}/events/${id}`).pipe(
            map(response => {
                return {
                    ...response.event,
                    date: new Date(response.event.date)
                };
            })
        );
    }

    updateEvent(id: string, event: EventModel, image: File | string): Observable<any> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        if (typeof image === 'string') {
            // No new image, just update the event data
            const eventData = {
                ...event,
                imagePath: image
            };
            return this.http.put(`${this.apiUrl}/events/${id}`, eventData, { headers });
        } else {
            // New image uploaded, use FormData
            const formData = new FormData();
            formData.append('title', event.title);
            formData.append('date', event.date.toISOString());
            formData.append('startTime', event.startTime);
            formData.append('endTime', event.endTime);
            formData.append('location', event.location);
            formData.append('description', event.description);
            formData.append('category', event.category);
            formData.append('image', image, image.name);

            return this.http.put(`${this.apiUrl}/events/${id}`, formData, { headers });
        }
    }

    deleteEvent(id: string): Observable<any> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.delete(`${this.apiUrl}/events/${id}`, { headers });
    }

    addFavourite(eventId: string): Observable<any> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post(`${this.apiUrl}/users/favourites/${eventId}`, { userId: this.authService.getUserId() }, { headers });
    }

    getFavourites(): Observable<any> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(`${this.apiUrl}/users/favourites/${this.authService.getUserId()}`, { headers });
    }

    removeFavourite(eventId: string): Observable<any> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.delete(`${this.apiUrl}/users/favourites/${eventId}`, { headers, body: { userId: this.authService.getUserId() } });
    }

    getEventsByCategory(category: string): Observable<EventModel[]> {
        return this.http.get<{ message: string, events: any[] }>(`${this.apiUrl}/categories/${category}`).pipe(
            map((response) => {
                return response.events.map(event => {
                    return {
                        ...event,
                        date: new Date(event.date)
                    };
                });
            })
        );
    }
    
}
