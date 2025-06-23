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
  }

  loadEvent(id: string): void {
    this.eventsService.getEvent(id).subscribe({
      next: (event) => {
        this.event = event;
      },
      error: (error) => {
        console.error('Error loading event:', error);
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
        console.log(response.message);
      },
      error: (error) => {
        if (error.status === 400) {
          console.log(error.error.message || 'This event is already in your favorites');
        } else {
          console.error('Error updating favorites:', error);
        }
      }
    });
  }
}
