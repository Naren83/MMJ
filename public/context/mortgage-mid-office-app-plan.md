# Mortgage Mid Office App Plan

## App Purpose

The Mortgage Mid Office app supports mid office users while they review mortgage cases. A user starts from the Case Overview screen, opens a case, reviews the process flow, checks documents, validates the main case sections, and records a decision.

The first version should focus on the case review experience using mock data. Business rules, real document upload, and integrations can be added later.

## Main User Journey

1. User opens the Case Overview screen.
2. User selects a mortgage case.
3. The Case Workspace opens.
4. The process flow appears in the middle of the screen.
5. The user reviews each process step.
6. The user opens Documents from the left sidebar.
7. Documents are shown by applicant and classified by process step.
8. The user can add, view, preview, or delete documents.
9. When previewing a document, the document takes 50% of the screen.
10. The user can continue working on the process while the document preview is open.
11. The user completes the review and records a decision.

## Case Overview Screen

The Case Overview screen shows all mortgage cases assigned to the Mid Office department.

### Case List Fields

- Case ID
- Applicant name
- Product type
- Requested loan amount
- Case status
- Priority
- SLA or deadline
- Assigned user or team
- Last updated date

### Case Overview Actions

- Open case
- Search by case ID or applicant name
- Filter by status
- Filter by priority
- Filter by assignee
- Filter by SLA
- Sort by urgency or last updated date

## Case Workspace Layout

When the user opens a case, the screen should become a working case area.

```text
Left sidebar | Middle process workspace | Optional document preview
```

### Layout Zones

| Area | Purpose |
| --- | --- |
| Left sidebar | Shows case tools such as Documents |
| Middle workspace | Shows the main process flow and selected process step |
| Preview panel | Shows a full document preview when selected |

## Process Flow

The process flow should be shown in the middle of the case workspace.

### Process Steps

1. Summary
2. Personal Details
3. External Liabilities
4. Collateral
5. Decision

The user should be able to move between these steps while reviewing the case.

## Summary Step

The Summary step gives the user a quick view of the mortgage request.

### Summary Information

- Case reference
- Applicant and co-applicant names
- Requested loan amount
- Property value
- Loan-to-value ratio
- Mortgage purpose
- Income summary
- Total liabilities summary
- Collateral summary
- Current case status
- Key risk flags

### Summary Actions

- Mark summary as reviewed
- Add internal note
- Flag missing information
- Flag inconsistent information

## Personal Details Step

The Personal Details step is used to review applicant identity, employment, income, and household information.

### Personal Details Information

- Primary applicant details
- Co-applicant details
- Address history
- Employment status
- Employer information
- Income details
- Household size
- Residency or citizenship status, if required
- Document verification status

### Personal Details Actions

- Confirm details
- Request correction
- Add review comment
- Flag identity issue
- Flag income issue

## External Liabilities Step

The External Liabilities step is used to review debts and obligations outside the bank or declared by the applicant.

### External Liability Types

- Credit cards
- Personal loans
- Car loans
- Student loans
- Existing mortgages
- Guarantees
- Alimony or maintenance obligations
- Other recurring debt

### External Liability Calculations

- Total monthly liability amount
- Debt-to-income ratio
- Remaining debt balances
- Affordability impact

### External Liability Actions

- Confirm liabilities
- Add missing liability
- Mark liability as verified
- Flag discrepancy with bureau or documents

## Collateral Step

The Collateral step is used to assess the property or security backing the mortgage.

### Collateral Information

- Property address
- Property type
- Purchase price
- Valuation amount
- Valuation date
- Loan-to-value ratio
- Ownership details
- Insurance status
- Existing liens or charges
- Collateral documents

### Collateral Actions

- Confirm collateral
- Request new valuation
- Flag valuation concern
- Mark collateral review complete

## Decision Step

The Decision step is used to record the Mid Office review outcome.

### Possible Decisions

- Approve for next step
- Approve with conditions
- Return to front office
- Request additional documents
- Reject or recommend decline
- Escalate to senior reviewer or credit risk

### Decision Information

- Decision result
- Reason codes
- Conditions
- Required documents
- Reviewer comments
- Timestamp
- Reviewer name
- Audit trail entry

## Left Sidebar

The left sidebar should be compact and icon-based.

### Main Sidebar Tool

- Documents

When the user clicks the Documents icon, a document panel opens.

## Document Panel

The document panel allows the user to manage documents linked to the mortgage case.

### Document Panel Actions

- Add document
- View document
- Preview document
- Delete document
- Filter by applicant
- Filter by process step

## Document Classification

Documents should be classified in two ways:

1. By applicant
2. By process flow step

## Applicant-Based Document View

At the top of the document panel, show applicant tabs or a selector.

```text
All Applicants | Primary Applicant | Co-Applicant
```

Each applicant should have their own document set.

## Process-Based Document Groups

Documents should be grouped under the matching process step.

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

## Document Row Information

Each document row should show:

- Document name
- Applicant
- Process step
- Document type
- Upload date
- Status
- Actions

## Document Statuses

Suggested document statuses:

- Uploaded
- Classified
- Needs Review
- Missing
- Rejected
- Verified

## Document Preview Behavior

When the user previews a document, the screen should split.

```text
Left sidebar | Process workspace 50% | Document preview 50%
```

The preview should take around 50% of the screen so the user can see the whole document while continuing the process review.

### Preview Panel Features

- Full document view
- Page scrolling
- Zoom in and zoom out
- Close preview
- Change selected document
- Keep the current process step open

## Working While Previewing

The user should not be forced to leave the process screen when previewing a document.

While the preview is open, the user can still:

- Review Summary
- Edit or check Personal Details
- Verify External Liabilities
- Review Collateral
- Enter Decision notes
- Move between process steps
- Keep the document visible for reference

## Suggested Case Statuses

- New
- In Review
- Pending Information
- Returned to Front Office
- Escalated
- Ready for Decision
- Approved by Mid Office
- Approved with Conditions
- Rejected
- Closed

## Suggested Angular Components

- case-overview
- case-workspace
- left-case-toolbar
- process-flow
- process-step-content
- summary-step
- personal-details-step
- external-liabilities-step
- collateral-step
- decision-step
- document-panel
- applicant-document-tabs
- document-classification-list
- document-actions
- document-preview-panel
- comments-notes
- audit-trail

## First Implementation Scope

The first implementation should include:

- Case Overview screen
- Open Case action
- Case Workspace screen
- Middle process flow
- Left Documents icon
- Document panel
- Applicant tabs
- Documents grouped by process step
- Add, view, delete, and preview document actions using mock data
- 50% document preview panel
- Ability to continue working on the process while preview is open

## Later Enhancements

- Real document upload
- Automatic document classification
- OCR or data extraction
- API integration
- Role-based permissions
- SLA monitoring
- Audit export
- Workflow rules
- Document verification rules
- Integration with credit bureau and collateral valuation systems
