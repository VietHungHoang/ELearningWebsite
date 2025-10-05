# Payment Service

## Overview
Payment Service manages payment processing for the E-learning platform. This service handles payment methods, transactions, and integration with payment gateways.

## Features

- **Payment Processing**: Handle various payment methods
- **Transaction Management**: Track payment transactions
- **Currency Support**: Multi-currency payment support

## Technologies
- **Spring Boot 3.5.5** - Main framework
- **Spring Data JPA** - Data access layer
- **PostgreSQL** - Primary database
- **Lombok** - Code generation
- **Jakarta Validation** - Input validation
- **Spring Kafka** - Message processing
- **Maven** - Build tool

## Project Structure
```
payment-service/
├── src/main/java/com/elearning/paymentservice/
│   ├── controller/
│   ├── service/
│   ├── dto/
│   ├── model/
│   ├── repository/
│   ├── exception/
│   ├── enums/
│   └── utils/
└── README.md
```

## API Usage

### Process Payment
```bash
POST /api/payments
Content-Type: application/json

{
  "amount": 100.00,
  "currency": "USD",
  "method": "credit_card"
}
```

## Database Schema
```sql
CREATE TABLE payment_methods (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE currencies (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(3) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  symbol VARCHAR(10),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```