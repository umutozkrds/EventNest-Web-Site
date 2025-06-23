import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private authListenerSubs: Subscription = new Subscription();

  constructor(private authService: AuthService) { }

  ngOnInit() {
    // Safe check for SSR - only get auth state if in browser
    if (typeof window !== 'undefined') {
      // Initialize with the current auth state
      this.isAuthenticated = this.authService.getIsAuth();

      // Subscribe to future auth state changes
      this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
      });
    }
  }

  ngOnDestroy() {
    // Clean up subscription to prevent memory leaks
    this.authListenerSubs.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }
}