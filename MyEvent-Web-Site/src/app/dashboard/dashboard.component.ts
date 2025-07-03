import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

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
export class DashboardComponent implements OnInit, OnDestroy {
    isSidebarOpen = false;
    userRole: string = '';
    isSubmitting = false;
    private authStatusSub!: Subscription;

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
        // Subscribe to authentication status changes
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe({
            next: (isAuthenticated) => {
                if (isAuthenticated) {
                    // Fetch user role when authenticated
                    this.fetchUserRole();
                } else {
                    // Clear user role when not authenticated
                    this.userRole = '';
                }
            }
        });

        // Also fetch user role on component initialization if already authenticated
        if (this.authService.getIsAuth()) {
            this.fetchUserRole();
        }
    }

    ngOnDestroy() {
        if (this.authStatusSub) {
            this.authStatusSub.unsubscribe();
        }
    }

    private fetchUserRole() {
        this.authService.getUserRole().subscribe({
            next: (response) => {
                this.userRole = response.role;
                console.log('User role updated:', this.userRole);
            },
            error: (error) => {
                console.error('Error fetching user role:', error);
                this.userRole = '';
            }
        });
    }

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    makeOrganizerRequest() {
        this.authService.makeRequest().subscribe({
            next: (response) => {
                console.log(response);
            }
        });
    }
} 