---
name: bug-reporting
description: "Use when a reproducible defect is found during manual or automated testing and must be documented in the project's Excel bug log with clear reproduction steps, expected and actual results, severity, priority, and evidence."
argument-hint: "Module and reproducible defect details"
---

# Bug Reporting

Use this workflow to verify, document, and append confirmed defects to the project bug log.

## Bug Log

- Store bug reports in `bug-reports/bugs.xlsx` on the `Bugs` worksheet.
- Use these columns in this exact order:
  1. `Bug ID`
  2. `Title`
  3. `Module`
  4. `Environment`
  5. `Platform`
  6. `Preconditions`
  7. `Steps to Reproduce`
  8. `Expected Result`
  9. `Actual Result`
  10. `Severity`
  11. `Priority`
  12. `Attachment`
  13. `Status`
- If the workbook does not exist, create it with a `Bugs` worksheet and the header row. If it exists, preserve all existing worksheets and rows; append the new bug to the existing `Bugs` worksheet, creating that sheet only if needed.
- Assign the next unused sequential ID in the form `BUG-001`, `BUG-002`, and so on. Check all existing IDs before assigning one.
- Use `QA`, `Web`, and `New` for Environment, Platform, and Status unless verified project context specifies otherwise.

## Confirm the Defect

1. Compare the observed result with the applicable manual test case, documented requirement, or explicitly stated expected behavior.
2. Reproduce the failure again when safe and practical. Check that the steps are deterministic and that test data or environment instability is not the cause.
3. If the behavior cannot be reproduced or the expected behavior is unclear, do not log it as a confirmed bug. Report it as an unconfirmed observation and state what evidence or clarification is needed.
4. Do not make changes to the application under test as part of bug reporting. Keep screenshots and recordings free of credentials, personal information, and unrelated customer data.

## Write the Report

- Write a concise title that states the failing behavior and context, for example: `Delivered order can still be cancelled without refreshing the page`.
- Record specific preconditions, then numbered, reproducible steps. Store steps as newline-separated text in Excel cells; do not put HTML `<br>` tags in cells.
- State the expected and actual results separately, based on evidence. Avoid vague wording such as “does not work.”
- Use the project's severity and priority conventions when available. Otherwise, describe impact: Critical for a core flow outage, data loss, or serious security impact; Major for important functionality that is incorrect; Minor for non-blocking behavior with a workaround; Trivial for cosmetic issues. Set priority by urgency and impact; do not infer it from severity alone. The supplied example is a Major defect with priority P1.
- Set Attachment to the relative screenshot or recording path when evidence is captured. If evidence cannot be captured, use `Not captured` and explain the limitation in the execution summary. Never claim an attachment exists when it does not.
- Do not include passwords, tokens, private user data, or sensitive query parameters in the workbook.

## Save and Validate

1. Add one complete row per confirmed defect to `bug-reports/bugs.xlsx`.
2. Reopen the workbook and confirm the `Bugs` sheet, exact headers, unique bug ID, and all 13 populated fields.
3. Verify that pre-existing rows and worksheets remain unchanged.
4. Report the bug ID, title, severity, priority, workbook path, and attachment path (if any). Also report any limitations or unconfirmed observations separately.