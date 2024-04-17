## voting-system-backend

This project is a Node.js Backend application designed to Voting System.

## Node Version 

Latest Node Version should be installed in your local machine

Node Version - 21.7.1
Npm Version - 10.5.0

## Setup postgres

1. Install docker on your system
2. Then run:

```bash
docker run -d --name vs-db-instance -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=votingSystem postgres
```

## Installation

1. Clone the repository to your local machine:  ``` git clone https://github.com/Abhishek0912/voting-system-backend ```

2. Navigate into the project directory: ``` cd voting-system-backend ```

3. Copy the .env.example file into .env : ``` cp .env.example .env ```

4. Install dependencies using npm:  ```npm install ```

## Usage

To start the development server and view the application in your browser, run: ```node index.js ```


