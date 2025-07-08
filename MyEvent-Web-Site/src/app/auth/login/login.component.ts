import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  loginStatus: { success: boolean; message: string } | null = null;
  private authStatusSub!: Subscription;
  returnUrl: string = '/';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // Get return URL from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.loginStatus = null;

    try {
      this.authService.login(
        form.value.email,
        form.value.password,
        (success, message) => {
          this.authService.getUserRole().subscribe({
            next: (response) => {
              // User role fetched successfully
            },
            error: (err) => {
              // Error fetching user role
            }
          });
          this.isLoading = false;
          this.loginStatus = { success, message };
          if (success) {
            form.resetForm();
            // Navigate to the return URL after successful login
            this.router.navigateByUrl(this.returnUrl);
          }
        }
      );
    } catch (error) {
      this.isLoading = false;
      this.loginStatus = { success: false, message: 'An error occurred during login' };
    }
  }
}
