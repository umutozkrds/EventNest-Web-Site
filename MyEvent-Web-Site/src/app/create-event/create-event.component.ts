import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EventsService } from '../services/events.service';
import { EventModel } from '../models/event.model';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css'],
  providers: [EventsService],
  standalone: false
})
export class CreateEventComponent implements OnInit {
  private isAuthenticated = false;
  private selectedFile: File | null = null;

  constructor(
    private eventsService: EventsService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.isAuthenticated = this.authService.getIsAuth();
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
    }
  }

  onFileSelected(event: Event) {
    this.selectedFile = (event.target as HTMLInputElement).files?.[0] || null;
  }

  onSubmit(form: NgForm) {
    if (form.invalid || !this.selectedFile) {
      return;
    }

    const event: EventModel = {
      title: form.value.title,
      date: new Date(form.value.date),
      startTime: form.value.startTime,
      endTime: form.value.endTime,
      location: form.value.location,
      description: form.value.description,
      category: form.value.category
    };

    this.eventsService.createEvent(event, this.selectedFile).subscribe({
      next: (response) => {
        form.reset();
        this.selectedFile = null;
        this.router.navigate(['/events']);
      },
      error: (error) => {
        console.error('Error creating event:', error);
      }
    });
  }
}
