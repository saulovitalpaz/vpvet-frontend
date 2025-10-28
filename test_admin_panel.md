# Admin Panel Testing Guide

## Prerequisites
1. Backend server running at http://localhost:5000
2. Frontend running at http://localhost:3000
3. Dr. Saulo account with role 'dr_saulo' and is_dr_saulo: true in database

## Manual Testing Steps

### 1. Login as Dr. Saulo
- Navigate to: http://localhost:3000/auth/login
- Email: dr.saulo@example.com (or any user with is_dr_saulo: true)
- Password: password

### 2. Verify Admin Access
- After login, check if admin dropdown appears in top-right
- Admin dropdown should have:
  - Painel Administrativo
  - Gerenciar Clínicas
  - Gerenciar Usuários
  - Gerenciar Clientes
  - Upload de Exames
  - Análises e Métricas

### 3. Test Admin Dashboard
- Click "Painel Administrativo" or go to: http://localhost:3000/admin
- Verify dashboard loads with:
  - Total de Clínicas
  - Usuários Ativos
  - Total de Clientes
  - Total de Exames
  - Consultas Hoje
  - Novos Clientes/Animais cards

### 4. Test Clinic Management
- Navigate to: http://localhost:3000/admin/clinics
- Test features:
  - List all clinics with user counts
  - Create new clinic button
  - Edit existing clinic
  - View clinic details

### 5. Test User Management
- Navigate to: http://localhost:3000/admin/users
- Test features:
  - List all users with roles
  - Create new secretary
  - Edit user details
  - Reset password functionality
  - Activate/deactivate users

### 6. Test Client Management
- Navigate to: http://localhost:3000/admin/clients
- Test features:
  - Search clients by name/email/CPF
  - Create new client
  - View client details with animals
  - View appointment history

### 7. Test Medical Uploads
- Navigate to: http://localhost:3000/admin/uploads
- Test features:
  - Upload exam notes (PDF)
  - Upload radiographies (multiple images)
  - Select animal for upload
  - Add findings and impressions

### 8. Test Analytics
- Navigate to: http://localhost:3000/admin/analytics
- Verify charts and metrics:
  - Appointment trends
  - User statistics
  - Clinic performance
  - Growth metrics

## Expected Results
All admin features should be accessible only to Dr. Saulo (user with is_dr_saulo: true).
Regular users (secretaries) should not see admin options or access admin URLs.

## Troubleshooting
If backend fails to start:
1. Check Flask is installed: `pip install flask`
2. Run with: `python -m app` (not `python app.py`)
3. Ensure virtual environment is activated

If admin pages show 403 error:
- Verify user has is_dr_saulo: true in database
- Check JWT token is being sent correctly

## Security Checks
- Non-admin users should not access /admin routes
- API endpoints should validate admin_required decorator
- JWT tokens should expire after 24 hours