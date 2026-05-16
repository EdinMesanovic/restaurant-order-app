# restaurant-order-app

## Local development

Frontend:
- `cd frontend`
- Copy `.env.example` to `.env`
- Set `VITE_API_URL=http://localhost:5555/api`
- Run `npm install`
- Run `npm run dev`

Backend:
- `cd backend`
- Copy `.env.example` to `.env`
- Set `PORT=5555`
- Set `MONGO_URI`
- Set `JWT_SECRET`
- Set `NODE_ENV=development`
- Set `CLIENT_URL=http://localhost:5173`
- Run `npm install`
- Run `npm run dev`

## Environment variables

Frontend:
- `VITE_API_URL`
  Development: `http://localhost:5555/api`
  Production: `https://api.smashburgers.edinmesan.ba/api`

Backend:
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `NODE_ENV`
- `CLIENT_URL`

Production backend example:
- `PORT=5555`
- `MONGO_URI=...`
- `JWT_SECRET=...`
- `NODE_ENV=production`
- `CLIENT_URL=https://smashburgers.edinmesan.ba`

## Frontend deploy

- Build from `frontend/` with `npm run build`
- The production frontend must use `VITE_API_URL=https://api.smashburgers.edinmesan.ba/api`
- Upload the generated `frontend/dist/` contents to the document root for `smashburgers.edinmesan.ba`
- The GitHub Actions FTP workflow builds the frontend with the production API URL before upload

## Backend deploy

- Deploy the contents of `backend/` to the cPanel app directory for `api.smashburgers.edinmesan.ba`
- Install backend dependencies on the server
- Create `backend/.env` with production values
- Start the API with `npm start`
- Ensure the Node.js app in cPanel points to `src/server.js`

## Production setup

- Frontend and backend are configured for separate domains
- Frontend API requests are read from `VITE_API_URL`
- Backend CORS allows local development origins and the configured `CLIENT_URL`
- Backend startup reads `PORT`, `MONGO_URI`, and `JWT_SECRET` from environment variables
- Do not commit `.env` files or secrets
