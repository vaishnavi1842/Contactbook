import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-upload-excel',
  templateUrl: './upload-excel.component.html',
  styleUrls: ['./upload-excel.component.scss']
})
export class UploadExcelComponent implements OnInit {
  fileData: any[] = [];
  errors: string[] = [];
  hasErrors = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }


  // Handle file input change event
  onFileChange(event: any): void {
    this.errors = []; // Reset errors
    const target: DataTransfer = <DataTransfer>event.target;

    if (target.files.length !== 1) {
      this.errors.push('Please select a single file.');
      this.hasErrors = true;
      return;
    }

    const file = target.files[0];
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      this.errors.push('Invalid file format. Only .xlsx and .xls are allowed.');
      this.hasErrors = true;
      return;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const binaryData = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(binaryData, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      this.validateData(jsonData);
    };
    reader.readAsBinaryString(file);
  }

  // Validate the parsed data
  validateData(data: any[]): void {
    this.fileData = [];
    this.errors = [];
    this.hasErrors = false;

    data.forEach((row, index) => {
      console.log(row);
      
      const { Name, Email, Phone } = row;
     
      // if (!Name || !Email || !Phone) {
      //   this.errors.push(`Row ${index + 2}: Missing essential fields (Name, Email, or Phone).`);
      //   this.hasErrors = true;
      //   return;
      // }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\d{10}$/;

      if (!emailRegex.test(Email)) {
        this.errors.push(`Row ${index + 2}: Invalid email format (${Email}).`);
        this.hasErrors = true;
      }

      if (!phoneRegex.test(Phone)) {
        this.errors.push(`Row ${index + 2}: Invalid phone number format (${Phone}).`);
        this.hasErrors = true;
      }

      if (!this.hasErrors) {
        this.fileData.push(row);
      }
    });
  }

  // Save validated data to LocalStorage
  saveToLocalStorage(): void {
    if (!this.fileData.length || this.hasErrors) {
      this.errors.push('Please fix validation errors before saving.');
      return;
    }

    localStorage.setItem('contacts', JSON.stringify(this.fileData));
    alert('Contacts saved to LocalStorage!');
    this.fileData = [];
    this.router.navigate(['./']);
  }
}
