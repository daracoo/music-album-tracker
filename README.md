# 🎵 Music Album Tracker

A simple full-stack application to track and rate music albums This project was done within the framework of the [CICD](https://www.finki.ukim.mk/mk/subject/%D0%BA%D0%BE%D0%BD%D1%82%D0%B8%D0%BD%D1%83%D0%B8%D1%80%D0%B0%D0%BD%D0%B0-%D0%B8%D0%BD%D1%82%D0%B5%D0%B3%D1%80%D0%B0%D1%86%D0%B8%D1%98%D0%B0-%D0%B8-%D0%B8%D1%81%D0%BF%D0%BE%D1%80%D0%B0%D0%BA%D0%B0) subject of [FCSE](https://www.finki.ukim.mk/mk).  
Built with **React (Vite + Tailwind)**, **Node.js + Express**, **Prisma ORM**, and **PostgreSQL**.  
The project demonstrates containerization with Docker, orchestration with Docker Compose, CI/CD pipeline via GitHub Actions and Kubernetes deployment.

---

## 📌 Features

- **Backend (Express + Prisma + PostgreSQL)**  
  - CRUD for albums: add, list, update status, rate  
  - Prisma ORM for database access  
  - Connected to PostgreSQL database  

- **Frontend (React + Vite + Tailwind)**  
  - Add new albums via form  
  - List albums with status & rating  
  - Simple responsive UI  

- **Database (PostgreSQL)**  
  - Stores albums (`title`, `artist`, `genre`, `status`, `rating`)  
  - Managed with Prisma migrations  

- **DevOps & Orchestration**
  - Docker containerization
  - Docker Compose for local development
  - Kubernetes manifests for production deployment
  - CI/CD pipeline with GitHub Actions

---

## 🚀 Getting Started

### 1️⃣ Run locally with Docker Compose

Clone the repository:
```bash
git clone https://github.com/<your-username>/music-album-tracker.git
cd music-album-tracker
```

Create a `.env` files one in backend for `DATABASE_URL=postgresql://postgres:postgres@db:5432/musicdb` and one in frontend for backend port -  `VITE_API_URL=http://localhost:4000`

Run with Docker Compose:
```
docker-compose up --build
```

➡️ **Services will be available at:**
- **Frontend** → http://localhost:5173
- **Backend API** → http://localhost:4000  
- **PostgreSQL** → localhost:5432

### 2️⃣ Development without Docker

1. **Start PostgreSQL locally**
2. **Update `.env` with correct database connection string**
3. **Install dependencies & run backend:**
   ```bash
   cd backend
   npm install
   npx prisma migrate dev
   npm run dev
   ```
4. **Install dependencies & run frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## ⚙️ CI/CD Pipeline (GitHub Actions)

GitHub Actions to automatically build and push Docker images to Docker Hub.

**Workflow file:** `.github/workflows/docker.yml`

### What it does:
- Runs on push to master branch
- Builds backend and frontend images  
- Pushes them to Docker Hub under your account

### Setup
1. Create Docker Hub personal access token
2. Add the following GitHub repo secrets:
   - `DOCKERHUB_USERNAME` → your Docker Hub username
   - `DOCKERHUB_TOKEN` → your personal access token

### Trigger
Whenever you push changes to master, GitHub Actions will:
- ✅ Checkout code
- ✅ Build Docker images  
- ✅ Push to Docker Hub

---

## ☸️ Kubernetes Deployment

This repository contains complete Kubernetes manifests for production-ready deployment with k3d.

### 🏗️ Architecture

The application consists of:
- **Frontend**: React application served by Nginx
- **Backend**: Node.js API with Express and Prisma ORM
- **Database**: PostgreSQL 17 with persistent storage
- **Ingress**: NGINX Ingress Controller for routing

### 📋 Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed and running
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) installed
- [k3d](https://k3d.io/#installation) installed

### 🚀 Quick Kubernetes Setup

#### 1. Create k3d Cluster

```bash
k3d cluster create music-cluster \
  --port "80:80@loadbalancer" \
  --port "443:443@loadbalancer" \
  --agents 1
```

#### 2. Install NGINX Ingress Controller

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

# Wait for ingress controller to be ready
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s
```

#### 3. Build and Load Docker Images

```bash
# Build images
docker build -t daracoo/music-album-tracker-backend:latest ./backend
docker build -t daracoo/music-album-tracker-frontend:latest ./frontend

# Import images into k3d cluster
k3d image import daracoo/music-album-tracker-backend:latest -c music-cluster
k3d image import daracoo/music-album-tracker-frontend:latest -c music-cluster
```

#### 4. Deploy to Kubernetes

```bash
cd k8s

# Apply manifests in order
kubectl apply -f namespace.yml
kubectl apply -f db-secret.yml
kubectl apply -f backend-config.yml
kubectl apply -f db-service.yml
kubectl apply -f db-statefulset.yml

# Wait for database to be ready
kubectl wait --for=condition=ready pod -l app=db -n music-app --timeout=120s

kubectl apply -f backend-service.yml
kubectl apply -f backend-deployment.yml
kubectl apply -f frontend-service.yml
kubectl apply -f frontend-deployment.yml
kubectl apply -f ingress.yml
```

#### 5. Configure Local DNS

Add the following line to your `/etc/hosts` file (Linux/macOS) or `C:\Windows\System32\drivers\etc\hosts` (Windows) - Run it as Administrator:

```
127.0.0.1 music.local
```

#### 6. Access the Application

Open your browser and navigate to: **http://music.local**

### 📁 Kubernetes Manifests

| File | Description |
|------|-------------|
| `namespace.yml` | Creates the music-app namespace |
| `db-secret.yml` | PostgreSQL credentials and configuration |
| `db-statefulset.yml` | PostgreSQL database deployment with persistent storage |
| `db-service.yml` | Database service configuration |
| `backend-config.yml` | Backend environment configuration |
| `backend-deployment.yml` | Backend API deployment with ConfigMap |
| `backend-service.yml` | Backend service configuration |
| `frontend-deployment.yml` | Frontend React app deployment |
| `frontend-service.yml` | Frontend service configuration |
| `ingress.yml` | Ingress routing configuration |

### 🔧 Kubernetes Management Commands

#### Check Application Status

```bash
# View all resources
kubectl get all -n music-app

# Check pod status
kubectl get pods -n music-app

# Check services and ingress
kubectl get svc,ingress -n music-app
```

#### View Logs

```bash
# Backend logs
kubectl logs -f deployment/backend -n music-app

# Frontend logs
kubectl logs -f deployment/frontend -n music-app

# Database logs
kubectl logs -f statefulset/db -n music-app
```

#### Scaling

```bash
# Scale backend
kubectl scale deployment backend --replicas=3 -n music-app

# Scale frontend
kubectl scale deployment frontend --replicas=2 -n music-app
```

### 🐛 Kubernetes Troubleshooting

#### Common Issues

**1. Pods not starting**
```bash
kubectl describe pod <pod-name> -n music-app
kubectl logs <pod-name> -n music-app
```

**2. Can't access via ingress**
```bash
# Check ingress status
kubectl describe ingress music-ingress -n music-app

# Port forward as fallback
kubectl port-forward service/frontend 8080:80 -n music-app
# Access via localhost:8080
```

**3. Database connection issues**
```bash
# Check if database is ready
kubectl get pods -n music-app -l app=db

# Test database connection
kubectl exec -it db-0 -n music-app -- psql -U postgres -d mydb
```

#### Alternative Access (Port Forwarding)

If ingress is not working:

```bash
# Frontend
kubectl port-forward service/frontend 3000:80 -n music-app
# Access at localhost:3000

# Backend API
kubectl port-forward service/backend 4000:4000 -n music-app
# Access at localhost:4000
```

### 🔄 Cluster Management

```bash
# Stop cluster (preserves all data and configurations)
k3d cluster stop music-cluster

# Start cluster
k3d cluster start music-cluster

# Delete cluster completely
k3d cluster delete music-cluster
```

### 📊 Environment Variables

#### Backend Configuration
- `DATABASE_URL`: PostgreSQL connection string
- Port: 4000

#### Database Configuration
- `POSTGRES_USER`: postgres
- `POSTGRES_PASSWORD`: password  
- `POSTGRES_DB`: mydb
- Port: 5432

#### Frontend Configuration
- Port: 80 (Nginx)

---

## 📁 Project Structure

```
music-album-tracker/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── k8s/
│   ├── namespace.yml
│   ├── db-secret.yml
│   ├── db-statefulset.yml
│   ├── db-service.yml
│   ├── backend-config.yml
│   ├── backend-deployment.yml
│   ├── backend-service.yml
│   ├── frontend-deployment.yml
│   ├── frontend-service.yml
│   └── ingress.yml
├── docker-compose.yml
├── .github/workflows/docker.yml
└── README.md
```

---

## 🔐 Security Notes

- Database credentials are stored in Kubernetes secrets
- All services use ClusterIP for internal communication
- External access only through ingress controller
- Environment variables properly configured via ConfigMaps

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---


## 🎯 Deployment Options Summary

| Method | Use Case | Command |
|--------|----------|---------|
| **Docker Compose** | Local development | `docker-compose up --build` |
| **Kubernetes (k3d)** | Production-like deployment | `kubectl apply -f k8s/` |
| **CI/CD Pipeline** | Automated builds | Push to `master` branch |

Choose the deployment method that best fits your needs! 🚀

---

## 👨‍💻 Author

**Darko Kuzmanoski 213153**  
---