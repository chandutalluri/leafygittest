# Database Restore Guide - LeafyHealth Platform

## Accessing Database Backup & Restore Management

1. **Navigate to System Dashboard**
   - From your current location, click the "Dashboard" option in the sidebar
   - Or go directly to the main system dashboard

2. **Find Database Backup & Restore Card**
   - Look for the green "Database Backup & Restore" card in the System Management section
   - It shows features like "AES-256 encrypted backups", "Point-in-Time Recovery", "Automated scheduling"

3. **Click to Access the Backup Management Interface**

## Database Restoration Methods

### Method 1: Point-in-Time Recovery (PITR)
**Best for:** Restoring to a specific moment in time

1. **Go to "Restore & PITR" tab**
2. **Select Target Date & Time**
   - Use the datetime picker to choose the exact moment
   - Example: "2025-06-23 14:30:00"
3. **Click "Execute PITR Restore"**
4. **Confirm the operation** (warning will appear about data loss)

**Important:** This restores the entire database to that specific timestamp. All data after that time will be lost.

### Method 2: Restore from Backup Archive
**Best for:** Restoring from a known good backup

1. **Go to "Restore & PITR" tab**
2. **Browse "Available Backups" section**
3. **Select a backup** from the list (shows date, type, size)
4. **Click "Restore" button** for that backup
5. **Confirm the restoration**

Available backup types:
- **Full**: Complete database snapshot
- **Differential**: Changes since last full backup
- **Incremental**: Changes since last backup
- **Logical**: Schema and data export (pg_dump)

### Method 3: Emergency Restore Using Scripts
**For advanced users or emergency situations**

1. **Access the server terminal**
2. **Use the PITR restore script**:
   ```bash
   ./scripts/pitr-restore.sh '2025-06-23 14:30:00'
   ```
3. **Or restore from specific backup**:
   ```bash
   pgbackrest --config=./config/pgbackrest.conf --stanza=leafyhealth restore
   ```

## Current Database Status
Based on your screenshot:
- **Total Tables**: 78 (fully operational)
- **Database Size**: 140,496 kB
- **Connection**: Live and connected
- **Tables Include**: analytics_events, api_keys, app_settings, attendance, audit_logs, and many more

## Backup Management Features

### Automated Backups
- **Full backups**: Weekly (Sundays at 2 AM)
- **Differential**: Mid-week (Wednesdays at 2 AM)
- **Incremental**: Every 6 hours
- **WAL archiving**: Every 5 minutes

### Security Features
- **AES-256 encryption** for all backups
- **Checksum verification** for integrity
- **Role-based access** (Super Admin only)
- **Secure storage** with retention policies

### Monitoring
- **Real-time job tracking**
- **Backup success/failure alerts**
- **Storage usage monitoring**
- **System health dashboard**

## Best Practices

### Before Restoring
1. **Document current state** - Note what needs to be restored
2. **Check backup integrity** - Verify backup is not corrupted
3. **Plan downtime** - Database will be unavailable during restore
4. **Backup current state** - Create a restore point before restoration

### During Restore
1. **Monitor progress** - Watch the job status in the UI
2. **Don't interrupt** - Let the process complete
3. **Check logs** - Review for any errors or warnings

### After Restore
1. **Verify data integrity** - Check critical tables and data
2. **Test application connectivity** - Ensure all services work
3. **Update users** - Inform about the restoration
4. **Create new restore point** - Mark the successful restoration

## Emergency Contact
If you encounter issues during restoration:
1. Check the backup service logs
2. Use the monitoring dashboard for status updates
3. Refer to the troubleshooting section in the backup system guide

## Quick Access Commands
- **Health check**: Visit `/api/backup-service/health`
- **Backup metrics**: Check the monitoring dashboard
- **Service status**: All services visible in system dashboard

The backup system is designed to be user-friendly while maintaining enterprise-grade reliability and security.