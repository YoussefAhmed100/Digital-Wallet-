# Digital Wallet

## Description

This project is a **Webhook Processing System** designed to handle incoming webhook payloads from various banks, parse and validate transaction data, and persist transactions in the database with idempotency guarantees. The system is built with scalability, maintainability, and robustness suitable for financial transaction processing.

---

## Technologies Used

- **Node.js** (v24.11.1+): JavaScript runtime environment for backend development.
- **NestJS**: Framework for building scalable and maintainable server-side applications.
- **TypeScript**: Strongly typed superset of JavaScript for better code quality.
- **PostgreSQL**: Relational database system used for persistent storage of transactions and wallets.
- **Drizzle ORM**: Type-safe ORM for PostgreSQL providing type inference and SQL generation.


---

## Architecture & Design Patterns

- **Factory Pattern**: For selecting the correct parser implementation based on the bank.
- **Strategy Pattern**: Each bank parser implements a common interface or abstract class to parse its unique payload.
- **Idempotency**: Ensures that repeated webhook requests with the same transaction reference do not create duplicates.
- **Separation of Concerns**: Parsing, business logic, and persistence layers are clearly separated.
- **Error Handling**: Returns detailed errors in API responses for invalid payloads or processing errors.

---

## Database

- **PostgreSQL**:
  - Stores transactions with unique references.
  - Stores wallet information and handles balance updates.
  - Supports ACID transactions to ensure consistency in balance and transaction creation.
- **Drizzle ORM**:
  - Provides type-safe querying and migrations.
  - Integrates seamlessly with NestJS services.
  - Ensures compile-time type checking for database operations.

---

## Key Features

- Multi-bank webhook parsing with custom payload handlers.
- Payload validation and error reporting.
- Idempotent transaction creation to prevent duplicates.
- Summary reporting of inserted and skipped transactions per webhook batch.
- Extensible architecture for adding new banks easily.

---

## Getting Started

### Prerequisites

- Node.js v22 or higher
- PostgreSQL instance (local or cloud)


### Installation

```bash
git clone https://github.com/YoussefAhmed100/Digital-Wallet-.git
cd Digital-Wallet-
npm install
