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

  constructor(private router: Router, private categoriesService: CategoriesService, private eventService: EventsService, private authService: AuthService) { }

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe(categories => {
      this.categories = categories.categories;
      console.log(this.categories);
    });


    this.eventService.getFeaturedEvents(this.authService.getUserId()).subscribe(events => {
      this.featuredEvents = events;
      console.log(this.featuredEvents);
    });
  }

  isFavourite(eventId: string): boolean {
    // Add null check and ensure it's an array
    if (!Array.isArray(this.favourites)) {
      console.warn('Favourites is not an array:', this.favourites);
      return false;
    }
    return this.favourites.includes(eventId);
  }

  addFavourite(eventId: string): void {
    this.eventService.addFavourite(eventId).subscribe({
      next: () => {
        console.log('Event added to favorites:', eventId);
        // Reload favorites after adding
        this.loadFavourites();
      },
      error: (error) => {
        console.error('Error adding favorite:', error);
      }
    });
  }

  loadFavourites(): void {
    this.eventService.getFavourites().subscribe({
      next: (response: any) => {
        console.log('Received favourites:', response);
        // Ensure favourites is always an array from the response
        this.favourites = Array.isArray(response.favourites) ? response.favourites : [];
      },
      error: (error) => {
        console.error('Error loading favourites:', error);
        this.favourites = [];
      }
    });
  }

  removeFavourite(eventId: string): void {
    this.eventService.removeFavourite(eventId).subscribe({
      next: () => {
        console.log('Event removed from favorites:', eventId);
        this.loadFavourites();
      },
      error: (error) => {
        console.error('Error removing favorite:', error);
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
}
