import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';



@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {

  displayedColumns: string[] = ['select', 'name', 'email', 'phone', 'actions'];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  contacts: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    this.dataSource = new MatTableDataSource(this.contacts);
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Filtering
  applyFilter(filterValue: any): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Selection Logic
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  // CRUD Operations
  viewContact(contact: any): void {
    alert(`Viewing Contact: ${JSON.stringify(contact)}`);
  }

  editContact(contact: any): void {
    const updatedName = prompt('Update Name', contact.Name);
    if (updatedName) {
      contact.Name = updatedName;
      this.saveContactsToLocalStorage();
    }
  }

  deleteContact(contact: any): void {
    if (confirm(`Are you sure you want to delete ${contact.Name}?`)) {
      this.contacts = this.contacts.filter((c) => c !== contact);
      this.updateTableData();
    }
  }

  deleteSelectedContacts(): void {
    if (confirm(`Are you sure you want to delete selected contacts?`)) {
      this.contacts = this.contacts.filter(
        (contact) => !this.selection.isSelected(contact)
      );
      this.selection.clear();
      this.updateTableData();
    }
  }

  exportSelectedContacts(): void {
    const selectedContacts = this.selection.selected;
    const csvContent = [
      ['Name', 'Email', 'Phone'],
      ...selectedContacts.map((contact) => [contact.Name, contact.Email, contact.Phone])
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'contacts.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Helper Functions
  updateTableData(): void {
    this.dataSource.data = this.contacts;
    this.saveContactsToLocalStorage();
  }

  saveContactsToLocalStorage(): void {
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }

}
