import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Statistic {
  value: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  features: Feature[] = [
    {
      icon: 'bi-shield-check',
      title: 'Secure Payments',
      description:
        'Bank-grade security with JWT authentication and encrypted transactions for complete peace of mind.',
    },
    {
      icon: 'bi-cash-stack',
      title: 'Automated Payroll',
      description:
        'Streamline salary disbursement with automated calculations, deductions, and instant slip generation.',
    },
    {
      icon: 'bi-graph-up-arrow',
      title: 'Smart Analytics',
      description:
        'Comprehensive reports and insights with customizable filters for data-driven decision making.',
    },
    {
      icon: 'bi-people',
      title: 'Multi-Role Access',
      description:
        'Role-based permissions for bank admins, organizations, and employees with dedicated dashboards.',
    },
    {
      icon: 'bi-clock-history',
      title: 'Real-Time Updates',
      description:
        'Instant notifications and status updates for all payment requests and salary disbursements.',
    },
    {
      icon: 'bi-file-earmark-pdf',
      title: 'Document Management',
      description:
        'Secure cloud storage for all financial documents with easy PDF and Excel export capabilities.',
    },
  ];

  statistics: Statistic[] = [
    {
      value: '500+',
      label: 'Concurrent Users',
      icon: 'bi-people-fill',
    },
    {
      value: '<2s',
      label: 'Response Time',
      icon: 'bi-speedometer2',
    },
    {
      value: '100%',
      label: 'Secure',
      icon: 'bi-shield-fill-check',
    },
    {
      value: '24/7',
      label: 'Available',
      icon: 'bi-clock-fill',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Component initialization logic
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }

  scrollToFeatures(): void {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
