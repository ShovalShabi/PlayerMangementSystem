# CI/CD Pipeline Documentation

## Overview

This repository includes a comprehensive CI/CD pipeline that automates testing, building, and deploying the Player Management System to Docker Hub.

## Pipeline Workflow

### Triggers

- **Push to main branch**: Automatically triggers the pipeline
- **Pull requests to main**: Runs tests and builds for validation
- **Manual trigger**: Can be triggered manually via GitHub Actions
- **Scheduled**: Runs daily at midnight UTC

### Jobs

#### 1. Test Backend Service (`test-backend`)

- Runs on Ubuntu latest
- Sets up Java 17 (Temurin distribution)
- Converts `gradlew` to Unix format for compatibility
- Runs backend tests using Gradle
- Uploads test results and logs as artifacts
- **Only runs backend tests** (no frontend testing as requested)

#### 2. Build and Deploy (`build-and-deploy`)

- Runs only after successful backend tests
- Only executes on pushes to main branch
- Builds and pushes Docker images to Docker Hub
- Tests the complete Docker Compose setup
- Includes comprehensive logging

## Required Secrets

To use this CI/CD pipeline, you need to configure the following secrets in your GitHub repository:

### How to Add Secrets

1. Go to your GitHub repository
2. Click on **Settings** tab
3. In the left sidebar, click on **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each secret with the exact names below

### Required Secrets

| Secret Name         | Description                  | How to Get                                         |
| ------------------- | ---------------------------- | -------------------------------------------------- |
| `DOCKERHUBUSERNAME` | Your Docker Hub username     | Your Docker Hub account username                   |
| `DOCKERHUBPASSWORD` | Your Docker Hub access token | Create at https://hub.docker.com/settings/security |

### Creating Docker Hub Access Token

1. Log in to [Docker Hub](https://hub.docker.com)
2. Go to **Account Settings** → **Security**
3. Click **New Access Token**
4. Give it a name (e.g., "GitHub Actions CI/CD")
5. Select **Read & Write** permissions
6. Copy the generated token and save it as `DOCKERHUBPASSWORD`

### Important: Create Docker Hub Repository

Before running the pipeline, you need to create a repository in your Docker Hub account:

1. Log in to [Docker Hub](https://hub.docker.com)
2. Click **Create Repository**
3. Create a repository with the exact name: `PlayerMangementSystem`
4. Set visibility (Public or Private as per your preference)
5. Click **Create**

**Note**: The pipeline will automatically create subdirectories for each service:

- `username/PlayerMangementSystem/player-service` (backend)
- `username/PlayerMangementSystem/players-dashboard` (frontend)
- `username/PlayerMangementSystem/mysql` (database)

## Pipeline Steps

### Test Phase

1. ✅ Checkout repository
2. ✅ Set up Java 17
3. ✅ Convert gradlew to Unix format
4. ✅ Set execution permissions
5. ✅ Run backend tests
6. ✅ Upload test results

### Build & Deploy Phase

1. ✅ Checkout repository
2. ✅ Set up Docker Buildx
3. ✅ Login to Docker Hub
4. ✅ Extract metadata for images
5. ✅ Build and push backend image
6. ✅ Build and push frontend image
7. ✅ Test Docker Compose setup
8. ✅ Health checks
9. ✅ Tear down services
10. ✅ Upload logs

## Image Naming Convention

The pipeline automatically tags images with:

- Branch name (e.g., `main`)
- Pull request number (for PRs)
- Semantic version tags (if using git tags)
- SHA-based tags (e.g., `main-abc123`)

### Image Structure

```
username/PlayerMangementSystem/
├── player-service:main
├── players-dashboard:main
└── mysql:main
```

## Logging

The pipeline includes comprehensive logging:

- All steps are logged with timestamps
- Test results are preserved as artifacts
- Build logs are uploaded for 30 days
- Service logs are captured during testing

## Troubleshooting

### Common Issues

1. **Gradle tests failing**: Check the test results artifact
2. **Docker build failing**: Verify Dockerfile syntax and dependencies
3. **Docker Hub authentication**: Ensure `DOCKERHUBUSERNAME` and `DOCKERHUBPASSWORD` are correctly set
4. **Repository not found**: Make sure you've created the `PlayerMangementSystem` repository in Docker Hub
5. **Health checks failing**: Check if services are starting properly
6. **Docker Compose issues**: The pipeline now uses pip-installed docker-compose for better compatibility

### Debugging

- Download the build logs artifact to see detailed execution logs
- Check the GitHub Actions run page for step-by-step execution
- Review the `ci_cd_log.txt` file for timestamped operations

## Security Notes

- Never commit secrets to the repository
- Use repository secrets for sensitive data
- Docker Hub tokens should have minimal required permissions
- Consider using GitHub's built-in security scanning features

## Customization

You can modify the pipeline by editing `.github/workflows/ci-cd.yml`:

- Change trigger conditions
- Add additional test steps
- Modify Docker image tags
- Add deployment to other environments
- Include additional security scans
