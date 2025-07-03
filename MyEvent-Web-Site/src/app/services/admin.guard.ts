import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router, UrlTree } from "@angular/router";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    // Define the admin user ID - replace this with your actual admin user ID
    // To find your user ID, log in and check the browser console for "Current User ID: xxx"
    private readonly ADMIN_USER_ID = environment.adminId; // Change this to your admin user ID

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

        // First check if user is authenticated
        const isAuth = this.authService.getIsAuth();
        if (!isAuth) {
            this.router.navigate(['/login'], {
                queryParams: { returnUrl: state.url }
            });
            return false;
        }

        // Get current user ID
        const currentUserId = this.authService.getUserId();

        // Console log for debugging - to help you find your admin user ID
        console.log('Current User ID:', currentUserId);
        console.log('Required Admin ID:', this.ADMIN_USER_ID);

        // Check if user is the admin
        if (currentUserId !== this.ADMIN_USER_ID) {
            // Redirect non-admin users to events page with error message
            this.router.navigate(['/events']);
            alert('Access denied. You do not have admin privileges.');
            return false;
        }

        return true;
    }
} 