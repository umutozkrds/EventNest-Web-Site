import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventModel } from '../models/event.model';
import { EventsService } from '../services/events.service';

@Component({
  selector: 'app-events-detail',
  standalone: false,
  templateUrl: './events-detail.component.html',
  styleUrl: './events-detail.component.css'
})
export class EventsDetailComponent implements OnInit {
  event: EventModel | null = null;
  isFavorite: boolean = false;
  attendedEvents: any[] = [];
  attendedPeople: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private eventsService: EventsService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadEvent(params['id']);
      }
    });
    this.loadAttendedEvents();
  }



  loadEvent(id: string): void {
    this.eventsService.getEvent(id).subscribe({
      next: (event) => {
        this.event = event;
      },
      error: (error) => {
        // Error loading event
      }
    });
  }

  getFormattedDate(date: Date | string | undefined): string {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getFormattedDay(date: Date | string | undefined): string {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.getDate().toString();
  }

  getFormattedMonth(date: Date | string | undefined): string {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  }

  addFavourite(eventId: string | undefined): void {
    if (!eventId) return;

    this.eventsService.addFavourite(eventId).subscribe({
      next: (response) => {
        this.isFavorite = !this.isFavorite;
      },
      error: (error) => {
        if (error.status === 400) {
          // This event is already in favorites
        } else {
          // Error updating favorites
        }
      }
    });
  }

  isAttended(eventId: string | undefined): boolean {
    return this.attendedEvents.includes(eventId);
  }

  addAttendedEvent(eventId: string | undefined): void {
    if (!eventId) return;
    this.eventsService.addAttendedEvent(eventId).subscribe({
      next: () => {
        this.loadAttendedEvents();
      },
      error: (error) => {
        // Error adding attended event
      }
    });
  }

  removeAttendedEvent(eventId: string | undefined): void {
    if (!eventId) return;
    this.eventsService.removeAttendedEvent(eventId).subscribe({
      next: () => {
        this.loadAttendedEvents();
      },
      error: (error) => {
        // Error removing attended event
      }
    });
  }

  loadAttendedEvents(): void {
    this.eventsService.getAttendedEvents().subscribe({
      next: (response: any) => {
        this.attendedEvents = response.attendedEvents;
      },
      error: (error) => {
        this.attendedEvents = [];
      }
    });
  }
}
