import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'MyEvent';
  isAuthenticated = false;

  constructor(private authService: AuthService) {
    // Call auto-auth as early as possible, but only in browser environment
    if (typeof window !== 'undefined') {
      this.authService.autoAuthUser();
    }
  }

  ngOnInit() {
    // Subscribe to authentication status changes
    this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });

    // Make sure we have the initial authentication state
    this.isAuthenticated = this.authService.getIsAuth();
  }
}
