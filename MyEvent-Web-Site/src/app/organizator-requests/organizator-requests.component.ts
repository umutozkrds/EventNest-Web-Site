import { Component, OnInit } from '@angular/core';

export interface OrganizerRequest {
  id?: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  experienceLevel: string;
  previousEvents?: number;
  motivation?: string;
  applicationDate: Date;
  status: 'pending' | 'approved' | 'rejected';
}

@Component({
  selector: 'app-organizator-requests',
  standalone: false,
  templateUrl: './organizator-requests.component.html',
  styleUrl: './organizator-requests.component.css'
})
export class OrganizatorRequestsComponent implements OnInit {
  loading = false;
  requests: OrganizerRequest[] = [];
  filteredRequests: OrganizerRequest[] = [];
  searchTerm = '';
  statusFilter = 'all';
  selectedRequest: OrganizerRequest | null = null;

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.loading = true;
    // Simulated data - replace with actual API call
    setTimeout(() => {
      this.requests = [
        {
          id: '1',
          userId: 'user1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          experienceLevel: 'Intermediate',
          previousEvents: 5,
          motivation: 'I have been organizing small community events for the past two years and would love to expand my reach.',
          applicationDate: new Date('2024-01-15'),
          status: 'pending'
        },
        {
          id: '2',
          userId: 'user2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+0987654321',
          experienceLevel: 'Advanced',
          previousEvents: 12,
          motivation: 'Professional event coordinator with extensive experience in corporate and social events.',
          applicationDate: new Date('2024-01-10'),
          status: 'approved'
        },
        {
          id: '3',
          userId: 'user3',
          name: 'Mike Johnson',
          email: 'mike.johnson@example.com',
          experienceLevel: 'Beginner',
          previousEvents: 1,
          motivation: 'Passionate about bringing people together through amazing events.',
          applicationDate: new Date('2024-01-20'),
          status: 'pending'
        },
        {
          id: '4',
          userId: 'user4',
          name: 'Sarah Wilson',
          email: 'sarah.wilson@example.com',
          phone: '+1122334455',
          experienceLevel: 'Intermediate',
          previousEvents: 8,
          motivation: 'Looking to contribute to the community by organizing meaningful events.',
          applicationDate: new Date('2024-01-08'),
          status: 'rejected'
        }
      ];
      this.filteredRequests = [...this.requests];
      this.loading = false;
    }, 1000);
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

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  }

  approveRequest(id: string) {
    const request = this.requests.find(r => r.id === id);
    if (request) {
      request.status = 'approved';
      this.filterRequests();
      // TODO: Add API call to approve request
      console.log('Approved request:', id);
    }
  }

  rejectRequest(id: string) {
    const request = this.requests.find(r => r.id === id);
    if (request) {
      request.status = 'rejected';
      this.filterRequests();
      // TODO: Add API call to reject request
      console.log('Rejected request:', id);
    }
  }

  viewDetails(request: OrganizerRequest) {
    this.selectedRequest = request;
    // TODO: Open modal programmatically if needed
    console.log('View details for:', request);
  }
}
