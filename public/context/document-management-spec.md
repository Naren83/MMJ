# Document Management Specification

## Purpose

Document Management allows Mid Office users to review, classify, manage, and preview mortgage case documents while continuing to work through the case process flow.

This specification covers only the document management capability.

## Scope

### In Scope

- Open document management from the case workspace
- Show documents grouped by applicant
- Classify documents by process flow step
- Add documents
- View document metadata
- Preview full documents
- Delete documents
- Keep document preview open while the user works on the process flow
- Use mock data for the first implementation

### Out of Scope for First Version

- Real file upload to a backend
- OCR
- Automatic classification
- Document extraction
- Digital signatures
- External document provider integration
- Virus scanning
- Document retention rules

## Entry Point

Document Management is opened from the left sidebar inside an active mortgage case.

The left sidebar should contain a Documents icon. When the user selects this icon, the document panel opens.

```text
Case Workspace
  Left Sidebar
    Documents Icon
```

## Screen Layout

When the document panel is closed:

```text
Left sidebar | Process workspace
```

When the document panel is open:

```text
Left sidebar | Document panel | Process workspace
```

When a document preview is open:

```text
Left sidebar | Process workspace 50% | Document preview 50%
```

The user must be able to continue working on the process flow while the preview panel is open.

## Applicant Classification

Documents should be classified by applicant at the top of the document panel.

### Applicant Tabs

```text
All Applicants | Primary Applicant | Co-Applicant
```

If there are more than two applicants, show all applicants in a selector or scrollable tab list.

### Applicant Rules

- Each document should belong to one applicant or to the full case.
- Case-level documents should appear under All Applicants.
- Applicant-specific documents should appear under the selected applicant.
- All Applicants should show every document linked to the case.

## Process Flow Classification

Documents should also be classified by process flow step.

### Process Steps

- Summary
- Personal Details
- External Liabilities
- Collateral
- Decision

Each document should have a process step classification.

## Document Groups

Documents should be displayed under the selected applicant and grouped by process step.

Example:

```text
Primary Applicant
  Summary
    Application Form
    Mortgage Request Summary

  Personal Details
    Passport
    ID Card
    Proof of Address
    Employment Contract
    Payslips

  External Liabilities
    Credit Bureau Report
    Loan Statements
    Credit Card Statements

  Collateral
    Property Valuation
    Purchase Agreement
    Land Registry
    Insurance Document

  Decision
    Approval Conditions
    Final Review Notes
```

## Document Data Model

Each document should contain the following fields:

| Field | Description |
| --- | --- |
| documentId | Unique document identifier |
| caseId | Mortgage case identifier |
| applicantId | Applicant identifier, if applicant-specific |
| applicantName | Applicant display name |
| documentName | User-facing document name |
| documentType | Type of document |
| processStep | Related process flow step |
| status | Current document status |
| uploadedBy | User who added the document |
| uploadedAt | Upload date and time |
| fileName | Original file name |
| fileType | File extension or MIME type |
| fileSize | File size |
| previewAvailable | Whether preview is available |

## Document Statuses

Suggested statuses:

- Uploaded
- Classified
- Needs Review
- Missing
- Rejected
- Verified

## Document Actions

### Add Document

The user should be able to add a document from the document panel.

Required fields:

- Applicant
- Process step
- Document type
- Document name
- File

First version behavior:

- Use mock upload behavior.
- Add the document to the selected applicant and process step.
- Show the document with status Uploaded.

### View Document

The user should be able to view document metadata.

Metadata view should show:

- Document name
- Applicant
- Process step
- Document type
- Status
- Uploaded by
- Uploaded date
- File name
- File type
- File size

### Preview Document

The user should be able to preview the full document.

Preview behavior:

- Preview opens on the right side of the case workspace.
- Preview takes about 50% of the screen width.
- The active process step remains visible.
- The user can continue working on the process flow.
- The user can close the preview panel.

Preview controls:

- Scroll pages
- Zoom in
- Zoom out
- Fit to width
- Open next document
- Open previous document
- Close preview

### Delete Document

The user should be able to delete a document.

Delete behavior:

- Show a confirmation prompt before delete.
- Remove the document from the visible list.
- For the first version, deletion can be mock-only.
- Later versions should create an audit trail entry.

## Filtering and Search

The document panel should support:

- Filter by applicant
- Filter by process step
- Filter by document status
- Search by document name
- Search by document type

## Empty States

### No Documents for Applicant

Show when the selected applicant has no documents.

Suggested message:

```text
No documents found for this applicant.
```

### No Documents for Process Step

Show when a process step has no documents.

Suggested message:

```text
No documents classified for this step.
```

### No Preview Available

Show when the selected document cannot be previewed.

Suggested message:

```text
Preview is not available for this document.
```

## Validation Rules

When adding a document:

- Applicant is required.
- Process step is required.
- Document type is required.
- Document name is required.
- File is required.

When deleting a document:

- User must confirm deletion.

## First Version Mock Data

The first implementation can use mock documents such as:

| Applicant | Process Step | Document Type | Document Name | Status |
| --- | --- | --- | --- | --- |
| Primary Applicant | Personal Details | ID | Passport | Verified |
| Primary Applicant | Personal Details | Address Proof | Utility Bill | Needs Review |
| Primary Applicant | External Liabilities | Credit Report | Credit Bureau Report | Classified |
| Co-Applicant | Personal Details | Income Proof | Payslip | Uploaded |
| Case Level | Collateral | Valuation | Property Valuation Report | Verified |
| Case Level | Decision | Conditions | Approval Conditions | Uploaded |

## Suggested Angular Components

- document-panel
- document-toolbar
- applicant-document-tabs
- document-filter-bar
- document-classification-list
- document-group
- document-row
- document-actions-menu
- add-document-dialog
- document-metadata-view
- document-preview-panel
- delete-document-confirmation

## Suggested UI Behavior

- Selecting an applicant updates the document groups.
- Selecting a process step filter narrows the visible documents.
- Clicking Preview opens the preview panel.
- Closing Preview returns the process workspace to full width.
- Adding a document updates the list immediately.
- Deleting a document removes it from the list after confirmation.
- The current process step should not reset when the document panel opens.
- The current process step should not reset when preview opens or closes.

## Acceptance Criteria

- User can open Document Management from the left sidebar.
- User can see documents grouped by applicant.
- User can see documents classified by process flow step.
- User can add a mock document.
- User can view document metadata.
- User can delete a mock document after confirmation.
- User can preview a document.
- Document preview uses about 50% of the screen.
- User can continue working on the process flow while preview is open.
- Closing preview restores the normal workspace layout.

## Future Enhancements

- Backend file upload
- File storage integration
- OCR extraction
- Automatic applicant matching
- Automatic process step classification
- Document quality checks
- Required document checklist
- Audit trail
- Role-based delete permissions
- Document versioning
- External document provider integration
