import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeBatchService } from '../../services/employee-batch.service';

@Component({
  selector: 'app-employee-batch-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-batch-upload.component.html',
  styleUrls: ['./employee-batch-upload.component.css'],
})
export class EmployeeBatchUploadComponent implements OnInit {
  selectedFile: File | null = null;
  fileName: string = '';

  // UI State
  isUploading = false;
  uploadProgress = 0;
  successMessage = '';
  errorMessage = '';

  // File validation
  maxFileSize = 10 * 1024 * 1024; // 10MB
  allowedExtensions = ['.csv'];

  // Upload history
  uploadHistory: UploadRecord[] = [];

  constructor(private employeeBatchService: EmployeeBatchService) {}

  ngOnInit(): void {
    this.loadUploadHistory();
  }

  loadUploadHistory(): void {
    const historyStr = localStorage.getItem('employeeUploadHistory');
    if (historyStr) {
      this.uploadHistory = JSON.parse(historyStr);
    }
  }

  saveUploadHistory(): void {
    localStorage.setItem('employeeUploadHistory', JSON.stringify(this.uploadHistory));
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate file
      const validationError = this.validateFile(file);
      if (validationError) {
        this.errorMessage = validationError;
        this.selectedFile = null;
        this.fileName = '';
        input.value = ''; // Reset input
        return;
      }

      this.selectedFile = file;
      this.fileName = file.name;
      this.errorMessage = '';
    }
  }

  validateFile(file: File): string | null {
    // Check file extension
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!this.allowedExtensions.includes(fileExtension)) {
      return 'Invalid file type. Please upload a CSV file.';
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      return `File size exceeds maximum limit of ${this.maxFileSize / 1024 / 1024}MB`;
    }

    // Check if file is empty
    if (file.size === 0) {
      return 'File is empty. Please select a valid CSV file.';
    }

    return null;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];

      const validationError = this.validateFile(file);
      if (validationError) {
        this.errorMessage = validationError;
        this.selectedFile = null;
        this.fileName = '';
        return;
      }

      this.selectedFile = file;
      this.fileName = file.name;
      this.errorMessage = '';
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.fileName = '';
    this.errorMessage = '';
    this.successMessage = '';

    // Reset file input
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file to upload';
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;
    this.errorMessage = '';
    this.successMessage = '';

    this.employeeBatchService
      .uploadEmployeeBatch(this.selectedFile)
      .subscribe({
        next: (response) => {
          this.isUploading = false;
          this.uploadProgress = 100;
          this.successMessage =
            response.message || 'Employee batch import job started successfully!';

          // Add to history
          this.addToHistory(true, this.selectedFile!.name);

          // Clear file after successful upload
          setTimeout(() => {
            this.removeFile();
            this.uploadProgress = 0;
          }, 3000);
        },
        error: (error) => {
          this.isUploading = false;
          this.uploadProgress = 0;
          this.errorMessage = error.error?.message || 'Failed to upload file. Please try again.';

          // Add to history
          this.addToHistory(false, this.selectedFile!.name, this.errorMessage);

          console.error('Upload error:', error);
        },
      });
  }

  addToHistory(success: boolean, fileName: string, errorMsg?: string): void {
    const record: UploadRecord = {
      fileName,
      timestamp: new Date().toISOString(),
      status: success ? 'Success' : 'Failed',
      message: success ? 'Batch job started successfully' : errorMsg || 'Upload failed',
    };

    this.uploadHistory.unshift(record);

    // Keep only last 10 records
    if (this.uploadHistory.length > 10) {
      this.uploadHistory = this.uploadHistory.slice(0, 10);
    }

    this.saveUploadHistory();
  }

  clearHistory(): void {
    this.uploadHistory = [];
    localStorage.removeItem('employeeUploadHistory');
  }

  downloadSampleCsv(): void {
    const sampleCsv = `firstName,lastName,email,phone,dateOfBirth,gender,department,designation,joiningDate,salary,bankAccountNumber,bankIfsc
John,Doe,john.doe@example.com,9876543210,1990-01-15,Male,IT,Software Engineer,2024-01-01,50000,123456789012,ABCD0123456
Jane,Smith,jane.smith@example.com,9876543211,1992-05-20,Female,HR,HR Manager,2024-01-15,60000,123456789013,ABCD0123457
Mike,Johnson,mike.j@example.com,9876543212,1988-08-10,Male,Finance,Accountant,2024-02-01,55000,123456789014,ABCD0123458`;

    const blob = new Blob([sampleCsv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'employee_import_sample.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  getFileSizeInMB(bytes: number): string {
    return (bytes / 1024 / 1024).toFixed(2);
  }

  formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleString();
  }
}

interface UploadRecord {
  fileName: string;
  timestamp: string;
  status: 'Success' | 'Failed';
  message: string;
}
