# Initial admin bootstrap

Set `INITIAL_ADMIN_USERNAME`, `INITIAL_ADMIN_EMAIL`, and `INITIAL_ADMIN_PASSWORD` in the deployment environment, then run:

```bash
node scripts/ensureInitialAdmin.js
```

The script is idempotent: if the username or email already exists, it promotes that user to `admin` when needed and never changes the existing password. A new password is only used when creating a new admin.

For production, set the variables only for the bootstrap command/container and remove them afterward. Never commit real credentials to Git.
