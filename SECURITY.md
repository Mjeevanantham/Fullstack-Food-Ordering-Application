# Security Policy

## Supported Versions

We actively support the latest version of Slooze. Security updates are prioritized for the current release.

## Security Features

### Authentication & Authorization
- JWT-based authentication with secure token storage
- Role-Based Access Control (RBAC) with CASL
- Password hashing with bcrypt (10 rounds)
- Token expiration and refresh mechanism

### API Security
- Rate limiting on all endpoints
- Input validation with Zod schemas
- SQL injection prevention (Prisma ORM)
- XSS protection (Helmet.js)
- CORS configuration

### Data Protection
- Environment variables for sensitive data
- Secure password storage (never plaintext)
- Country-scoped data access
- Input sanitization

## Reporting a Vulnerability

If you discover a security vulnerability, please follow these steps:

1. **Do NOT** create a public GitHub issue
2. Email security details to: [security-email]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity

## Security Best Practices

### For Developers
- Never commit secrets or API keys
- Use environment variables
- Keep dependencies updated
- Follow secure coding practices
- Review code before merging

### For Users
- Use strong passwords
- Don't share credentials
- Log out when done
- Report suspicious activity

## Known Security Considerations

1. **Stripe Keys**: Use test keys in development, never commit production keys
2. **JWT Secrets**: Use strong, random secrets in production
3. **Database**: Use connection pooling and secure connections
4. **CORS**: Configure allowed origins properly in production

## Updates

Security updates will be communicated through:
- GitHub Security Advisories
- Release notes
- Direct notification (for critical issues)

## Compliance

This application follows security best practices but is provided as-is for educational/demonstration purposes. For production use, conduct a thorough security audit.

