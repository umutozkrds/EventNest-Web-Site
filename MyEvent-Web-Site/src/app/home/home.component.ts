import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CategoryModel } from '../models/category.model';
import { EventModel } from '../models/event.model';
import { CategoriesService } from '../services/categories.service';
import { EventsService } from '../services/events.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  featuredEvents: EventModel[] = [];
  favourites: any[] = [];
  categories: CategoryModel[] = [];
  attendedEvents: any[] = [];
  constructor(private router: Router, private categoriesService: CategoriesService, private eventService: EventsService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadFavourites();
    this.loadAttendedEvents();
    this.categoriesService.getCategories().subscribe(categories => {
      this.categories = categories.categories;
    });


    this.eventService.getFeaturedEvents(this.authService.getUserId()).subscribe(events => {
      this.featuredEvents = events;
    });
  }

  isFavourite(eventId: string): boolean {
    // Add null check and ensure it's an array
    if (!Array.isArray(this.favourites)) {
      return false;
    }
    return this.favourites.includes(eventId);
  }

  addFavourite(eventId: string): void {
    this.eventService.addFavourite(eventId).subscribe({
      next: () => {
        // Reload favorites after adding
        this.loadFavourites();
      },
      error: (error) => {
        // Error adding favorite
      }
    });
  }

  loadFavourites(): void {
    this.eventService.getFavourites().subscribe({
      next: (response: any) => {
        // Ensure favourites is always an array from the response
        this.favourites = Array.isArray(response.favourites) ? response.favourites : [];
      },
      error: (error) => {
        this.favourites = [];
      }
    });
  }

  removeFavourite(eventId: string): void {
    this.eventService.removeFavourite(eventId).subscribe({
      next: () => {
        this.loadFavourites();
      },
      error: (error) => {
        // Error removing favorite
      }
    });
  }

  getFormattedTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getFormattedDay(date: Date): string {
    return date.getDate().toString();
  }

  getFormattedMonth(date: Date): string {
    return date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  }

  viewEventDetails(eventId: number): void {
    this.router.navigate(['/events', eventId]);
  }

  isAttended(eventId: string): boolean {
    return this.attendedEvents.includes(eventId);
  }

  addAttendedEvent(eventId: string): void {
    this.eventService.addAttendedEvent(eventId).subscribe({
      next: () => {
        this.loadAttendedEvents();
      },
      error: (error) => {
        // Error adding attended event
      }
    });
  }

  removeAttendedEvent(eventId: string): void {
    this.eventService.removeAttendedEvent(eventId).subscribe({
      next: () => {
        this.loadAttendedEvents();
      },
      error: (error) => {
        // Error removing attended event
      }
    });
  }

  loadAttendedEvents(): void {
    this.eventService.getAttendedEvents().subscribe({
      next: (response: any) => {
        this.attendedEvents = response.attendedEvents;
      },
    });
  }
}
