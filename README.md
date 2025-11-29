# Node.js Backend API
================================

## 🗂️  Description

This project is a Node.js backend API designed to manage a shop's operations, including product management, cart management, order management, and task management. The API provides a robust and scalable solution for handling various business logic and interactions with the database.

The API is built using Express.js, PostgreSQL, and MongoDB, with a focus on security, authentication, and authorization. It includes features such as role-based access control, JSON Web Token (JWT) authentication, and logging.

## ✨ Key Features

### **Product Management**

*   Retrieve products
*   Manage product details

### **Cart Management**

*   Add items to cart
*   Retrieve cart contents
*   Manage cart operations

### **Order Management**

*   Create orders
*   Retrieve order details
*   Manage order operations

### **Task Management**

*   Create tasks
*   Retrieve tasks
*   Update task status
*   Delete tasks

### **Authentication and Authorization**

*   JSON Web Token (JWT) authentication
*   Role-based access control (RBAC)

## 🗂️ Folder Structure

```mermaid
graph TD;
  src-->controllers;
  src-->models;
  src-->routes;
  src-->services;
  src-->utils;
  src-->app;
  src-->db;
  src-->migrations;
  src-->queues;
  src-->tests;
  models-->PostgreSQL;
  models-->Mongo;
```

## 🛠️ Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge)
![Express.js](https://img.shields.io/badge/Express.js-000?logo=express&logoColor=white&style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white&style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4ea94b?logo=mongodb&logoColor=white&style=for-the-badge)
![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white&style=for-the-badge)

## ⚙️ Setup Instructions

### Prerequisites

*   Node.js (version 16 or higher)
*   PostgreSQL (version 13 or higher)
*   MongoDB (version 5 or higher)
*   Docker (optional)

### Installation

1.  Clone the repository:

    ```bash
git clone https://github.com/DinarMin/Backend-API-nodeJs.git
```
2.  Install dependencies:

    ```bash
cd Backend-API-nodeJs
npm install
```
3.  Create a `.env` file and add environment variables:

    ```makefile
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=shop
```
4.  Run migrations:

    ```bash
npm run migrate
```
5.  Start the server:

    ```bash
npm start
```

## 📝 API Endpoints

The API provides various endpoints for managing products, carts, orders, and tasks. Please refer to the [API documentation](https://example.com/api-docs) for a comprehensive list of endpoints and their usage.

## 🤖 GitHub Actions

This repository uses GitHub Actions for continuous integration and deployment. The workflow is defined in the `.github/workflows/main.yml` file and includes the following steps:

*   Build and test the application
*   Deploy to a production environment

## 📊 Testing

The project includes tests for various components, including API endpoints, services, and controllers. You can run tests using the following command:

```bash
npm test
```



<br><br>
<div align="center">
<img src="https://avatars.githubusercontent.com/u/175533404?v=4" width="120" />
<h3>Dinar</h3>
<p>Backend developer with expertise in Node.js.</p>
</div>
<br>
<p align="right">
<img src="https://gitfull.vercel.app/appLogo.png" width="20"/>  <a href="https://gitfull.vercel.app">Made by GitFull</a>
</p>
    