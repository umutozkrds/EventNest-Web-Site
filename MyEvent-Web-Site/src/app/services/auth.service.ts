import { HttpClient } from "@angular/common/http";
import { User } from "../models/user.model";
import { Observable, Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private token: string = '';
    private userId: string = '';
    private authStatusListener = new Subject<boolean>();
    private isAuthenticated = false;
    private userRole: string = '';
    constructor(private http: HttpClient, private router: Router) { }

    getToken() {
        return this.token;
    }

    getUserId() {
        return this.userId;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    signup(name: string, email: string, password: string): Observable<any> {
        const authData: User = { name: name, email: email, password: password };
        return this.http.post<{ message: string, userId: string }>('http://188.132.197.87/api/users/signup', authData);
    }

    login(email: string, password: string, callback?: (success: boolean, message: string) => void) {
        const authData = { email: email, password: password };

        this.http.post<{ token: string, expiresIn: number, userId: string }>('http://188.132.197.87/api/users/login', authData)
            .subscribe({
                next: response => {
                    this.token = response.token;
                    if (this.token) {
                        this.userId = response.userId;
                        this.isAuthenticated = true;
                        this.authStatusListener.next(true);
                        const expiresInDuration = response.expiresIn;
                        this.saveAuthData(this.token, new Date(new Date().getTime() + expiresInDuration * 1000), this.userId);
                        
                        // Let the component handle navigation
                        if (callback) {
                            callback(true, "Login successful!");
                        }
                    }
                    this.router.navigate(['/events']);
                },
                error: error => {
                    console.error('Login error:', error);
                    this.authStatusListener.next(false);
                    if (callback) {
                        const message = error.error?.message || "Authentication failed. Please check your credentials.";
                        callback(false, message);
                    }
                }
            });
    }

    logout() {
        this.token = '';
        this.isAuthenticated = false;
        this.userId = '';
        this.authStatusListener.next(false);
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    autoAuthUser() {

        // Skip authentication check if we're not in a browser environment
        if (typeof window === 'undefined') {
            return;
        }

        const authInformation = this.getAuthData();

        if (!authInformation) {
            // Make sure to explicitly set authentication status to false
            this.isAuthenticated = false;
            this.authStatusListener.next(false);
            return;
        }

        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

        if (expiresIn > 0) {
            this.token = authInformation.token;
            this.userId = authInformation.userId || '';
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
        } else {
            this.clearAuthData();
            this.isAuthenticated = false;
            this.authStatusListener.next(false);
        }
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string) {
        // Check if we're in a browser environment
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
            localStorage.setItem('expiration', expirationDate.toISOString());
            localStorage.setItem('userId', userId);
        }
    }

    private clearAuthData() {
        // Check if we're in a browser environment
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('expiration');
            localStorage.removeItem('userId');
        }
    }

    private getAuthData() {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
            return null;
        }

        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        if (!token || !expirationDate) {
            return null;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        }
    }

    getUserRole() {
        const userId = localStorage.getItem('userId');
        return this.http.get<{ role: string }>('http://188.132.197.87/api/users/role/' + userId).subscribe({
            next: response => {
                return response.role;
            },
            error: error => {
                console.error('Error getting user role:', error);
            }
        });
    }
}
