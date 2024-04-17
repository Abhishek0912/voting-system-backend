## Setup postgres

1. Install docker on your system
2. Then run:

```bash
docker run -d --name vs-db-instance -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=votingSystem postgres
```

# voting-system-backend

1. npm install
2. cp .env.example .env
3. node index.js

