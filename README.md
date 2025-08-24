# Foodiary API

A serverless REST API for a food diary application built with Node.js, TypeScript, and AWS services. This API provides authentication, meal management, user profiles, and goal tracking functionality.

## 🚀 Features

- **Authentication**: Complete user authentication system using AWS Cognito
- **Meal Management**: Create, retrieve, and process meal entries with image uploads
- **User Profiles**: Manage user profile information and preferences
- **Goal Tracking**: Set and monitor nutrition and fitness goals
- **Image Processing**: AI-powered meal analysis and image processing
- **Email Notifications**: Custom email templates for user communications

## 🏗️ Architecture

This project follows a clean architecture pattern with the following structure:

```
src/
├── application/     # Application business logic
├── infra/          # Infrastructure and external services
├── kernel/         # Core domain entities and interfaces
├── main/           # Entry points and adapters
└── shared/         # Shared utilities and types
```

### AWS Services Used

- **AWS Lambda**: Serverless compute for API endpoints
- **API Gateway**: HTTP API for REST endpoints
- **DynamoDB**: NoSQL database for data persistence
- **S3**: File storage for meal images
- **CloudFront**: CDN for image delivery
- **Cognito**: User authentication and authorization
- **SQS**: Message queue for meal processing
- **SES**: Email delivery service

## 📋 Prerequisites

- Node.js 22.x or higher
- pnpm package manager
- AWS CLI configured with appropriate permissions
- Serverless Framework

## 📚 API Documentation

A documentação completa da API está disponível usando interface Scalar:

- **Desenvolvimento Local**: `pnpm run docs:serve` → http://localhost:3001/docs
- **Produção**: https://api.foodiary.com/docs
- **Especificação OpenAPI**: Disponível em `/docs/openapi.json`

### Recursos da Documentação

- ✨ Interface moderna e interativa com Scalar
- 🔍 Busca avançada de endpoints
- 🔐 Teste de endpoints com autenticação JWT
- 📋 Exemplos de código automáticos
- 📱 Totalmente responsiva

## 🛠️ Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd foodiary-api
```

2. Install dependencies:

```bash
pnpm install
```

3. Configure environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

## 🚀 Development

### Local Development

Start the development server:

```bash
serverless dev
```

This will start a local emulator of AWS Lambda and tunnel your requests to and from AWS Lambda.

### Type Checking

Run TypeScript type checking:

```bash
pnpm typecheck
```

### Email Development

Start the email development server to preview email templates:

```bash
pnpm dev:email
```

### Documentation Development

Start the documentation server locally:

```bash
pnpm run docs:serve
```

Validate OpenAPI specification:

```bash
pnpm run docs:validate
```

## 🗄️ Database Schema

The application uses DynamoDB with a single-table design:

### Main Table Structure

- **PK**: Primary key (partition key)
- **SK**: Sort key
- **GSI1PK**: Global Secondary Index partition key
- **GSI1SK**: Global Secondary Index sort key

### Data Models

- **Users**: User accounts and authentication data
- **Meals**: Meal entries with images and nutritional information
- **Profiles**: User profile information
- **Goals**: User nutrition and fitness goals

## 🔧 Configuration

### Environment Variables

Key environment variables that need to be configured:

- `AWS_REGION`: AWS region for deployment
- `STAGE`: Deployment stage (dev, staging, prod)
- `USER_POOL_ID`: Cognito User Pool ID
- `USER_POOL_CLIENT_ID`: Cognito User Pool Client ID
- `OPENAI_API_KEY`: OpenAI API key for meal analysis

### Serverless Configuration

The project uses Serverless Framework with the following configuration:

- **Runtime**: Node.js 22.x
- **Region**: sa-east-1 (São Paulo)
- **Memory**: 128MB (default), 1024MB for processing functions
- **Timeout**: 120 seconds for processing functions

## 🚀 Deployment

### Deploy to Development

```bash
serverless deploy --stage dev
```

### Deploy to Production

```bash
serverless deploy --stage prod
```

### Deploy Specific Functions

```bash
serverless deploy function --function functionName
```

## 📊 Monitoring

The application includes monitoring and alerting:

- **CloudWatch Logs**: Function execution logs
- **CloudWatch Metrics**: Performance and error metrics
- **SNS Alarms**: Dead letter queue monitoring

## 🔒 Security

- **JWT Authentication**: All protected endpoints require valid JWT tokens
- **IAM Roles**: Least privilege access to AWS services
- **Input Validation**: Zod schema validation for all inputs

## 🧪 Testing

Run tests (when implemented):

```bash
pnpm test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🤝 Support

For support and questions, please contact the development team or create an issue in the repository.
