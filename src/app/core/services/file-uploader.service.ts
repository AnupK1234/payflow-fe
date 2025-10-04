import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileUploaderService {
  private readonly MAX_FILE_SIZE_MB = 5;
  private readonly MAX_FILE_SIZE_BYTES = this.MAX_FILE_SIZE_MB * 1024 * 1024;

  constructor() {}

  /**
   * Validates file size against a maximum limit.
   * @param files Array of files to validate.
   * @returns The list of valid files, or throws an error for invalid files.
   */
  validateFiles(files: File[]): File[] {
    const invalidFiles = files.filter((file) => file.size > this.MAX_FILE_SIZE_BYTES);

    if (invalidFiles.length > 0) {
      throw new Error(
        `One or more files exceed the ${this.MAX_FILE_SIZE_MB}MB limit. Please select smaller files.`
      );
    }
    return files;
  }

  /**
   * Creates a FormData object containing JSON data and documents.
   */
  createFormData(data: any, files: File[]): FormData {
    const formData = new FormData();

    // Add JSON data as blob
    formData.append(
      'data',
      new Blob([JSON.stringify(data)], {
        type: 'application/json',
      })
    );

    // Add documents
    files.forEach((file) => {
      formData.append('documents', file, file.name); // Include file name
    });

    return formData;
  }
}
