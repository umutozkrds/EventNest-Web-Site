import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CategoryModel } from '../models/category.model';
import { EventModel } from '../models/event.model';
import { CategoriesService } from '../services/categories.service';
@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  featuredEvents: EventModel[] = [];

  categories: CategoryModel[] = [];

  constructor(private router: Router, private categoriesService: CategoriesService) { }

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe(categories => {
      this.categories = categories.categories;
      console.log(this.categories);
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
