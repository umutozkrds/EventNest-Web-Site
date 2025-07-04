import { Component, OnInit } from '@angular/core';
import { EventsService } from '../services/events.service';
import { EventModel } from '../models/event.model';

@Component({
  selector: 'app-adminpanel',
  standalone: false,
  templateUrl: './adminpanel.component.html',
  styleUrl: './adminpanel.component.css'
})
export class AdminpanelComponent implements OnInit {
  events: EventModel[] = [];
  loading = false;

  constructor(private eventsService: EventsService) { }

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.loading = true;
    this.eventsService.getEvents().subscribe({
      next: (events) => {
        this.events = events.filter(event => event.status === 'pending');
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.loading = false;
      }
    });
  }

  deleteEvent(eventId: string) {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventsService.deleteEvent(eventId).subscribe({
        next: () => {
          this.loadEvents(); // Reload the events list
        },
        error: (error) => {
          console.error('Error deleting event:', error);
        }
      });
    }
  }

  getStatusBadgeClass(status?: string): string {
    const statusLower = (status || 'active').toLowerCase();

    switch (statusLower) {
      case 'active':
        return 'bg-success';
      case 'pending':
        return 'bg-warning';
      default:
        return 'bg-success';
    }
  }

  approveEvent(eventId: string) {
    this.loading = true;
    this.eventsService.approveEvent(eventId).subscribe({
      next: (response) => {
        console.log('Event approved successfully:', response);
        this.loadEvents();
        alert('Event approved successfully!');
      },
      error: (error) => {
        console.error('Error approving event:', error);
        this.loading = false;
        alert('Failed to approve event. Please try again.');
      }
    });
  }
}
