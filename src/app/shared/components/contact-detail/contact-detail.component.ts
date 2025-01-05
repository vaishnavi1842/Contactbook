import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss']
})
export class ContactDetailComponent implements OnInit {
  contactId: string | null = '';
  contact: any = null;
  isEditing: boolean = false;
  editedContact: any = {};
  isEditingInProgress: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.contactId = params.get('id');
      if (this.contactId) {
        this.loadContact(this.contactId);
      }
    });
  }


  // Load contact from localStorage
  loadContact(contactId: string): void {
    const contact = JSON.parse(localStorage.getItem('contacts') || '[]').find((c: any) => c.id === contactId);
    if (contact) {
      this.contact = contact;
      this.editedContact = { ...contact };
    }
  }

  // Start editing the contact
  startEditing(): void {
    const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    const contactBeingEdited = contacts.find((c: any) => c.id === this.contactId && c.isEditing);
    
    if (contactBeingEdited) {
      this.snackBar.open('This contact is currently being edited by another user', 'Close', { duration: 3000 });
    } else {
      this.isEditing = true;
      this.contact.isEditing = true;
      localStorage.setItem('contacts', JSON.stringify(contacts)); // Lock the contact for editing
    }
  }

  // Save changes to the contact
  saveChanges(): void {
    if (this.isEditingInProgress) {
      this.snackBar.open('Please wait, changes are being saved', 'Close', { duration: 3000 });
      return;
    }

    this.isEditingInProgress = true;
    const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    const contactIndex = contacts.findIndex((c: any) => c.id === this.contactId);

    if (contactIndex !== -1) {
      // Save the edited contact
      contacts[contactIndex] = { ...this.editedContact };
      contacts[contactIndex].isEditing = false; // Unlock the contact after editing
      localStorage.setItem('contacts', JSON.stringify(contacts));

      this.contact = { ...this.editedContact };
      this.isEditing = false;
      this.snackBar.open('Contact saved successfully', 'Close', { duration: 3000 });
    }

    this.isEditingInProgress = false;
  }

  // Cancel the editing
  cancelEditing(): void {
    this.isEditing = false;
    this.editedContact = { ...this.contact }; // Restore original contact
  }

  // Delete the contact
  deleteContact(): void {
    if (confirm('Are you sure you want to delete this contact?')) {
      const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
      const updatedContacts = contacts.filter((c: any) => c.id !== this.contactId);
      localStorage.setItem('contacts', JSON.stringify(updatedContacts));
      this.router.navigate(['/']);
      this.snackBar.open('Contact deleted successfully', 'Close', { duration: 3000 });
    }
  }


}
