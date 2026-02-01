# Project Name

## Description

This project is a **Webhook Processing System** designed to handle incoming webhook payloads from different banks, parse and validate transaction data, and persist transactions in the database with idempotency support. The system is built with scalability, maintainability, and reliability in mind, suitable for financial applications involving multiple banking integrations.

---

## Technologies Used

- **Node.js** (v20+): JavaScript runtime environment for backend development.
- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **TypeScript**: Adds static typing and modern features to JavaScript for enhanced developer experience and code quality.
- **MongoDB**: NoSQL document-oriented database used to store transaction and wallet data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js, providing schema-based data validation.
- **AWS S3** (optional): For file storage if used (mention if applicable).
- **Jest**: For unit and integration testing (if implemented).

---

## Architecture & Design Patterns

- **Factory Pattern**: To dynamically select the appropriate parser for different banks.
- **Strategy Pattern**: Each bank parser implements a common interface or abstract class to parse payloads.
- **Idempotency**: Transaction creation is idempotent, preventing duplicate entries on repeated webhook calls.
- **Separation of Concerns**: Clear separation between parsing, business logic, and persistence.
- **Error Handling**: Consistent error responses to clients; errors are returned, not only logged.

---

## Database

- **MongoDB**:
  - Stores transaction documents with unique reference identifiers.
  - Stores wallet information and maintains balances.
  - Supports atomic updates for transactions and wallet balance consistency.

---

## Key Features

- Parses webhook payloads from multiple banks with custom parsing logic.
- Validates payload format and transaction data.
- Ensures idempotent transaction creation to avoid duplicates.
- Provides detailed success/skipped counts per webhook batch.
- Easily extendable to support additional banks and parsing strategies.
- Returns errors in API responses instead of logging only.

---

## Getting Started

### Prerequisites

- Node.js v20 or higher
- MongoDB instance (local or cloud)
- (Optional) AWS credentials for S3 integration

### Installation

```bash
git clone https://github.com/your-repo/project.git
cd project
npm install
