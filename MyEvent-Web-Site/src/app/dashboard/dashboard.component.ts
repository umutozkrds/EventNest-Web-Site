import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    standalone: false
})
export class DashboardComponent implements OnInit {
    isSidebarOpen = false;

    constructor() { }

    ngOnInit() {
    }

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }
} 