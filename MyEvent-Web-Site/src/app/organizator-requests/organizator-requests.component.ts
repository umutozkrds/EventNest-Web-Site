import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { OrganizerRequest } from '../models/organizers.model';




@Component({
  selector: 'app-organizator-requests',
  standalone: false,
  templateUrl: './organizator-requests.component.html',
  styleUrl: './organizator-requests.component.css'
})
export class OrganizatorRequestsComponent implements OnInit {
  loading = false;
  filteredRequests: any[] = [];
  searchTerm = '';
  statusFilter = 'all';
  selectedRequest: any | null = null;
  requests: any[] = [];


  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.loading = true;
    this.authService.getRequests().subscribe({
      next: (response) => {
        this.requests = response.requests;
        this.filteredRequests = [...this.requests];
        this.loading = false;
      },
      error: (error) => {
        // Error loading requests
        this.loading = false;
      }
    });
  }

  filterRequests() {
    this.filteredRequests = this.requests.filter(request => {
      const matchesSearch = !this.searchTerm ||
        request.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.statusFilter === 'all' || request.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  setStatusFilter(status: string) {
    this.statusFilter = status;
    this.filterRequests();
  }

  getPendingCount(): number {
    return this.requests.filter(r => r.status === 'pending').length;
  }

  getApprovedCount(): number {
    return this.requests.filter(r => r.status === 'approved').length;
  }

  getRejectedCount(): number {
    return this.requests.filter(r => r.status === 'rejected').length;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-warning text-dark';
      case 'approved': return 'bg-success';
      case 'rejected': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending': return 'bi-clock';
      case 'approved': return 'bi-check-circle';
      case 'rejected': return 'bi-x-circle';
      default: return 'bi-question-circle';
    }
  }



  approveRequest(userId: string) {
    this.loading = true;
    this.authService.approveRequest(userId).subscribe({
      next: (response) => {
        // Reload the requests to reflect the change in UI
        this.loadRequests();
        // You can add a success message here if needed
        alert('Request approved successfully!');
      },
      error: (error) => {
        this.loading = false;
        // Show error message to user
        alert('Failed to approve request. Please try again.');
      }
    });
  }

  rejectRequest(id: string) {
    const request = this.requests.find(r => r.id === id);
    if (request) {
      request.status = 'rejected';
      this.filterRequests();
      // TODO: Add API call to reject request
    }
  }
}
