#!/bin/bash
# Backup script for Bürger-App Schieder-Schwalenberg

BACKUP_DIR="/home/ubuntu/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="buergerapp_backup_${TIMESTAMP}"

echo "Creating backup: ${BACKUP_NAME}"

# Create backup directory
mkdir -p "${BACKUP_DIR}"

# Backup database
echo "Backing up database..."
mysqldump -uroot -ppassword buergerapp > "${BACKUP_DIR}/${BACKUP_NAME}_database.sql"

# Backup uploaded files (if any)
if [ -d "/home/ubuntu/buergerapp-schieder/uploads" ]; then
    echo "Backing up uploaded files..."
    tar -czf "${BACKUP_DIR}/${BACKUP_NAME}_uploads.tar.gz" -C /home/ubuntu/buergerapp-schieder uploads
fi

# Backup .env file
echo "Backing up configuration..."
cp /home/ubuntu/buergerapp-schieder/.env "${BACKUP_DIR}/${BACKUP_NAME}_env"

echo "Backup completed: ${BACKUP_DIR}/${BACKUP_NAME}"
echo ""
echo "Files created:"
ls -lh "${BACKUP_DIR}/${BACKUP_NAME}"*

# Clean up old backups (keep last 7 days)
echo ""
echo "Cleaning up old backups..."
find "${BACKUP_DIR}" -name "buergerapp_backup_*" -mtime +7 -delete
echo "Done!"

