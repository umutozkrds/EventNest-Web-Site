import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  adminId = environment.adminId;
  isAuthenticated = false;
  private authListenerSubs: Subscription = new Subscription();
  userId: string = '';
  constructor(private authService: AuthService) { }

  ngOnInit() {
    // Safe check for SSR - only get auth state if in browser
    if (typeof window !== 'undefined') {
      // Initialize with the current auth state
      this.isAuthenticated = this.authService.getIsAuth();
      this.userId = this.authService.getUserId(); // Get initial userId too

      // Subscribe to future auth state changes
      this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
        console.log(this.userId);
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