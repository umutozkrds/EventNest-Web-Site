import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

export interface OrganizerRequestForm {
    experienceLevel: string;
    previousEvents: number;
    phone: string;
    motivation: string;
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    standalone: false
})
export class DashboardComponent implements OnInit {
    isSidebarOpen = false;
    userRole: string = '';
    hasRequestPending = false;
    isSubmitting = false;

    organizerRequest: OrganizerRequestForm = {
        experienceLevel: '',
        previousEvents: 0,
        phone: '',
        motivation: ''
    };

    constructor(private authService: AuthService) {
        this.authService = authService;
    }

    ngOnInit() {
        this.authService.getUserRole().subscribe({
            next: (response) => {
                this.userRole = response.role;
                console.log(this.userRole);
            }
        });
    }

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    makeOrganizerRequest() {
        this.authService.makeRequest(this.authService.getUserId()).subscribe({
            next: (response) => {
                console.log(response);
            }
        });
    }
} 