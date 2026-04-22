# Security Specification: Academy Management System

## Data Invariants
1. Students cannot edit their own profiles; only Admins can.
2. Students can only read their own academic and attendance records.
3. Only Admins can manage (create/update/delete) any record.
4. Finance data (Income/Expense) is strictly readable and writable only by Admins.
5. `studentId` in `academic_records` and `attendance` must link to an existing student.

## The Dirty Dozen Payloads
1. **Identity Spoofing**: Attempt to create a student profile as a normal user.
2. **Privilege Escalation**: Attempt to add self to `/admins/` collection.
3. **Data Leak**: A student attempting to read another student's academic record.
4. **Finance Peeking**: A student attempting to read the `/income/` collection.
5. **Unauthorized Modification**: A student trying to update their own attendance to 'present'.
6. **Orphaned Writes**: Creating an academic record for a non-existent `studentId`.
7. **Shadow fields**: Adding `isAdmin: true` to a student document.
8. **Invalid Types**: Sending a string for `amount` in finance records.
9. **Large Payloads**: Sending 1MB of junk text in the `address` field.
10. **ID Poisoning**: Using a 500-character string as a `studentId`.
11. **Timestamp Manipulation**: Sending a manual `createdAt` date from the future.
12. **Cross-Tenant Attack**: Attempting to list all students without a specific where clause.

## Test Runner (Conceptual)
All above payloads should return `PERMISSION_DENIED` based on our `firestore.rules`.
