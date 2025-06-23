import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    standalone: false
})
export class DashboardComponent implements OnInit {
    isSidebarOpen = false;
    userRole: string = '';

    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.authService.getUserRole().subscribe({
            next: (response) => {
                this.userRole = response.role;
            }
        });
    }

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }
} 