import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
// import { Switch } from '@/components/ui/switch';
// import { Progress } from '@/components/ui/progress';
import {
  AlertCircle,
  Calendar,
  Clock,
  Database,
  Download,
  RefreshCw,
  Shield,
  Settings,
  Trash2,
  Play,
  Pause,
  Eye,
  Plus,
} from 'lucide-react';

interface BackupJob {
  id: number;
  jobId: string;
  type: string;
  status: string;
  fileName?: string;
  fileSize?: string;
  startedAt: string;
  completedAt?: string;
  error?: string;
  createdBy?: string;
  metadata?: any;
}

interface RestoreJob {
  id: number;
  backup_id: number;
  status: string;
  restore_type: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  backup_file_name?: string;
  backup_file_size?: string;
}

interface BackupSchedule {
  id: number;
  name: string;
  cron_expression: string;
  backup_type: string;
  retention_days: number;
  is_active: boolean;
  created_at: string;
  last_run_at?: string;
  next_run_at?: string;
}

interface ServiceHealth {
  status: string;
  service: string;
  port: string;
  timestamp: string;
}

export default function DatabaseBackupRestore() {
  const [backupJobs, setBackupJobs] = useState<BackupJob[]>([]);
  const [restoreJobs, setRestoreJobs] = useState<RestoreJob[]>([]);
  const [schedules, setSchedules] = useState<BackupSchedule[]>([]);
  const [serviceHealth, setServiceHealth] = useState<ServiceHealth | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serviceStatus, setServiceStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [activeTab, setActiveTab] = useState('overview');

  // Dialog states
  const [showCreateBackup, setShowCreateBackup] = useState(false);
  const [showCreateSchedule, setShowCreateSchedule] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [selectedBackupForRestore, setSelectedBackupForRestore] = useState<BackupJob | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [backupToDelete, setBackupToDelete] = useState<BackupJob | null>(null);

  // Form states
  const [backupType, setBackupType] = useState('manual');
  const [scheduleName, setScheduleName] = useState('');
  const [cronExpression, setCronExpression] = useState('0 2 * * *');
  const [retentionDays, setRetentionDays] = useState(30);
  const [restoreType, setRestoreType] = useState('full');
  const [professionalBackups, setProfessionalBackups] = useState<any[]>([]);

  // Check service health
  const checkServiceHealth = async () => {
    try {
      setServiceStatus('checking');
      setError(null);

      const response = await fetch('/api/backup-restore/health');
      if (response.ok) {
        const data = await response.json();
        setServiceHealth(data);
        setServiceStatus('online');
      } else {
        throw new Error(`Service returned ${response.status}`);
      }
    } catch (err) {
      console.warn('Service health check failed:', err);
      setServiceStatus('offline');
      setServiceHealth(null);
      setError('Database backup service is offline');
    }
  };

  // Fetch backup jobs
  const fetchBackupJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/backup-restore/backup/jobs');
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          // Filter to show only recent backups (last 7 days) and completed ones
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

          const relevantBackups = data.data
            .filter((backup: BackupJob) => {
              const backupDate = new Date(backup.startedAt);
              // Show only backups from last 7 days OR completed backups
              return backupDate >= sevenDaysAgo || backup.status === 'completed';
            })
            .slice(0, 20); // Limit to 20 most recent backups

          setBackupJobs(relevantBackups);
        } else {
          setBackupJobs([]);
        }
      } else {
        throw new Error(`Failed to fetch backup jobs: ${response.status}`);
      }
    } catch (err) {
      console.warn('Failed to fetch backup jobs:', err);
      setBackupJobs([]);
      setError('Failed to load backup history');
    } finally {
      setLoading(false);
    }
  };

  // Fetch restore jobs
  const fetchRestoreJobs = async () => {
    try {
      const response = await fetch('/api/backup-restore/restore/list');
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setRestoreJobs(data.data);
        } else {
          setRestoreJobs([]);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch restore jobs:', err);
      setRestoreJobs([]);
    }
  };

  // Fetch schedules
  const fetchSchedules = async () => {
    try {
      const response = await fetch('/api/backup-restore/schedule/list');
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setSchedules(data.data);
        } else {
          setSchedules([]);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch schedules:', err);
      setSchedules([]);
    }
  };

  // Fetch professional backups - only show new backups
  const fetchProfessionalBackups = async () => {
    try {
      const response = await fetch('/api/backup-restore/backup/professional/list');
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.backups)) {
          // Filter to show only professional backups (not JSON)
          const professionalOnly = data.backups.filter(
            (backup: any) => backup.fileName.endsWith('.sql') || backup.fileName.endsWith('.dump')
          );
          setProfessionalBackups(professionalOnly);
        } else {
          setProfessionalBackups([]);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch professional backups:', err);
      setProfessionalBackups([]);
    }
  };

  // Create backup - using professional pg_dump backup
  const createBackup = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/backup-restore/backup/professional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: backupType === 'full' ? 'custom' : 'logical' }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('Professional backup created:', data.metadata);
          setError(null);
          // Show success message
          alert(
            `Backup created successfully! File: ${data.metadata.fileName}, Size: ${data.metadata.fileSize}`
          );
        } else {
          setError(data.message || 'Backup failed');
        }
        setShowCreateBackup(false);
        await fetchBackupJobs();
        await fetchProfessionalBackups();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `Backup creation failed: ${response.status}`);
      }
    } catch (err) {
      console.error('Failed to create backup:', err);
      setError((err as any)?.message || 'Failed to create backup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Start restore
  const startRestore = async () => {
    if (!selectedBackupForRestore) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/backup-restore/restore/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          backupId: selectedBackupForRestore.id,
          restoreType,
        }),
      });

      if (response.ok) {
        setShowRestoreDialog(false);
        setSelectedBackupForRestore(null);
        await fetchRestoreJobs();
      } else {
        throw new Error(`Restore failed: ${response.status}`);
      }
    } catch (err) {
      console.warn('Failed to start restore:', err);
      setError('Failed to start restore');
    } finally {
      setLoading(false);
    }
  };

  // Create schedule
  const createSchedule = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/backup-restore/schedule/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: scheduleName,
          cronExpression,
          backupType,
          retentionDays,
        }),
      });

      if (response.ok) {
        setShowCreateSchedule(false);
        setScheduleName('');
        await fetchSchedules();
      } else {
        throw new Error(`Schedule creation failed: ${response.status}`);
      }
    } catch (err) {
      console.warn('Failed to create schedule:', err);
      setError('Failed to create schedule');
    } finally {
      setLoading(false);
    }
  };

  // Download professional backup
  const downloadProfessionalBackup = async (fileName: string) => {
    try {
      const response = await fetch(
        `/api/backup-restore/backup/professional/download/${encodeURIComponent(fileName)}`
      );
      if (!response.ok) {
        throw new Error('Failed to download backup');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to download backup:', err);
      alert('Failed to download backup. Please try again.');
    }
  };

  // Delete backup
  const deleteBackup = async () => {
    if (!backupToDelete) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/backup-restore/backup/${backupToDelete.jobId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setShowDeleteConfirm(false);
          setBackupToDelete(null);
          await fetchBackupJobs();
          await fetchProfessionalBackups();
        } else {
          throw new Error(data.message || 'Delete failed');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `Delete failed: ${response.status}`);
      }
    } catch (err) {
      console.error('Failed to delete backup:', err);
      setError((err as any)?.message || 'Failed to delete backup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const restoreProfessionalBackup = async (fileName: string) => {
    if (
      !confirm(
        `Are you sure you want to restore the database from ${fileName}? This will replace all current data.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch('/api/backup-restore/backup/professional/restore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Database restored successfully in ${data.duration}!`);
        // Refresh all data
        await Promise.all([fetchBackupJobs(), fetchRestoreJobs(), fetchProfessionalBackups()]);
      } else {
        throw new Error(data.error || 'Restore failed');
      }
    } catch (err) {
      console.error('Failed to restore backup:', err);
      alert('Failed to restore backup. Please try again.');
    }
  };

  // Initial load
  useEffect(() => {
    const initializePage = async () => {
      await checkServiceHealth();
      await Promise.all([
        fetchBackupJobs(),
        fetchRestoreJobs(),
        fetchSchedules(),
        fetchProfessionalBackups(),
      ]);
    };

    initializePage().catch(err => {
      console.warn('Failed to initialize page:', err);
      setError('Failed to initialize database backup system');
    });
  }, []);

  // Format date safely
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString || 'Unknown';
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case 'completed':
          return 'bg-green-100 text-green-800';
        case 'failed':
          return 'bg-red-100 text-red-800';
        case 'running':
          return 'bg-blue-100 text-blue-800';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return <Badge className={getStatusColor(status)}>{status}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Database Backup & Restore</h1>
          <p className="text-gray-600 mt-1">Professional PostgreSQL database management system</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                serviceStatus === 'online'
                  ? 'bg-green-500'
                  : serviceStatus === 'offline'
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
              }`}
            ></div>
            <span className="text-sm font-medium">
              {serviceStatus === 'online'
                ? 'Service Online'
                : serviceStatus === 'offline'
                  ? 'Service Offline'
                  : 'Checking...'}
            </span>
          </div>

          {serviceHealth && <div className="text-xs text-gray-500">Port {serviceHealth.port}</div>}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertCircle className="text-red-400 mr-3" size={20} />
              <div>
                <h3 className="text-red-800 font-medium">Error</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>Essential backup and restore operations</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Dialog open={showCreateBackup} onOpenChange={setShowCreateBackup}>
            <DialogTrigger asChild>
              <Button disabled={loading || serviceStatus !== 'online'}>
                <Database className="w-4 h-4 mr-2" />
                Create Backup
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Database Backup</DialogTitle>
                <DialogDescription>
                  Create a new backup of your PostgreSQL database
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="backupType">Backup Type</Label>
                  <Select value={backupType} onValueChange={setBackupType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual Backup</SelectItem>
                      <SelectItem value="scheduled">Scheduled Backup</SelectItem>
                      <SelectItem value="emergency">Emergency Backup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateBackup(false)}>
                  Cancel
                </Button>
                <Button onClick={createBackup} disabled={loading}>
                  {loading ? 'Creating...' : 'Create Backup'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showCreateSchedule} onOpenChange={setShowCreateSchedule}>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={loading || serviceStatus !== 'online'}>
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Backup
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Backup Schedule</DialogTitle>
                <DialogDescription>
                  Set up automated backup scheduling with cron expressions
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="scheduleName">Schedule Name</Label>
                  <Input
                    id="scheduleName"
                    value={scheduleName}
                    onChange={e => setScheduleName(e.target.value)}
                    placeholder="Daily Database Backup"
                  />
                </div>
                <div>
                  <Label htmlFor="cronExpression">Cron Expression</Label>
                  <Input
                    id="cronExpression"
                    value={cronExpression}
                    onChange={e => setCronExpression(e.target.value)}
                    placeholder="0 2 * * *"
                  />
                  <p className="text-sm text-gray-500 mt-1">Daily at 2:00 AM (0 2 * * *)</p>
                </div>
                <div>
                  <Label htmlFor="retentionDays">Retention Days</Label>
                  <Input
                    id="retentionDays"
                    type="number"
                    value={retentionDays}
                    onChange={e => setRetentionDays(parseInt(e.target.value))}
                    min={1}
                    max={365}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateSchedule(false)}>
                  Cancel
                </Button>
                <Button onClick={createSchedule} disabled={loading || !scheduleName}>
                  {loading ? 'Creating...' : 'Create Schedule'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={checkServiceHealth} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Check Service
          </Button>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="restores">Restores</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Backups</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{backupJobs.length}</div>
                <p className="text-xs text-muted-foreground">
                  {backupJobs.filter(job => job.status === 'completed').length} completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Schedules</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {schedules.filter(s => s.is_active).length}
                </div>
                <p className="text-xs text-muted-foreground">{schedules.length} total schedules</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Restores</CardTitle>
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{restoreJobs.length}</div>
                <p className="text-xs text-muted-foreground">
                  {restoreJobs.filter(job => job.status === 'completed').length} successful
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="backups" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Backup History</CardTitle>
              <CardDescription>Complete list of database backup operations</CardDescription>
            </CardHeader>
            <CardContent>
              {loading && backupJobs.length === 0 ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-600">Loading backup history...</p>
                </div>
              ) : backupJobs.length === 0 ? (
                <div className="text-center py-8">
                  <Database className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No backup jobs found</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Create your first backup to see it here
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3">Job ID</th>
                        <th className="text-left py-3">Type</th>
                        <th className="text-left py-3">Status</th>
                        <th className="text-left py-3">Size</th>
                        <th className="text-left py-3">Started</th>
                        <th className="text-left py-3">Completed</th>
                        <th className="text-left py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {backupJobs.map(job => (
                        <tr key={job.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 font-mono text-xs">{job.jobId}</td>
                          <td className="py-3 capitalize">{job.type}</td>
                          <td className="py-3">
                            <StatusBadge status={job.status} />
                          </td>
                          <td className="py-3">{job.fileSize || 'N/A'}</td>
                          <td className="py-3">{formatDate(job.startedAt)}</td>
                          <td className="py-3">
                            {job.completedAt ? formatDate(job.completedAt) : 'N/A'}
                          </td>
                          <td className="py-3">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedBackupForRestore(job);
                                  setShowRestoreDialog(true);
                                }}
                                disabled={job.status !== 'completed'}
                              >
                                <Play className="w-3 h-3 mr-1" />
                                Restore
                              </Button>
                              {job.fileName && (
                                <Button size="sm" variant="outline">
                                  <Download className="w-3 h-3 mr-1" />
                                  Download
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setBackupToDelete(job);
                                  setShowDeleteConfirm(true);
                                }}
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Professional Backups Section */}
          <Card>
            <CardHeader>
              <CardTitle>Professional PostgreSQL Backups</CardTitle>
              <CardDescription>Production-grade pg_dump backups (zero downtime)</CardDescription>
              <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm">
                <p className="font-medium text-blue-900">Backup Location:</p>
                <p className="text-blue-700 font-mono text-xs mt-1">
                  /home/runner/workspace/backend/domains/database-backup-restore/backups/
                </p>
                <p className="font-medium text-blue-900 mt-2">Features:</p>
                <ul className="text-blue-700 text-xs mt-1 ml-4 list-disc">
                  <li>Logical (.sql) and Custom (.dump) format backups</li>
                  <li>Complete database structure and data</li>
                  <li>Professional restoration with conflict resolution</li>
                  <li>Checksum verification for integrity</li>
                </ul>
              </div>
            </CardHeader>
            <CardContent>
              {professionalBackups.length === 0 ? (
                <div className="text-center py-8">
                  <Database className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No professional backups found</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Create a professional backup using the button above
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3">Filename</th>
                        <th className="text-left py-3">Type</th>
                        <th className="text-left py-3">Size</th>
                        <th className="text-left py-3">Created</th>
                        <th className="text-left py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {professionalBackups.map(backup => (
                        <tr key={backup.fileName} className="border-b hover:bg-gray-50">
                          <td className="py-3">
                            <div>
                              <p className="font-mono text-xs">{backup.fileName}</p>
                              <p className="text-xs text-gray-500">Location: {backup.filePath}</p>
                            </div>
                          </td>
                          <td className="py-3 capitalize">{backup.type}</td>
                          <td className="py-3">{backup.fileSize || backup.size}</td>
                          <td className="py-3">{formatDate(backup.createdAt)}</td>
                          <td className="py-3">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadProfessionalBackup(backup.fileName)}
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </Button>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => restoreProfessionalBackup(backup.fileName)}
                              >
                                <RefreshCw className="w-3 h-3 mr-1" />
                                Restore
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restores" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Restore Operations</CardTitle>
              <CardDescription>History of database restore operations</CardDescription>
            </CardHeader>
            <CardContent>
              {restoreJobs.length === 0 ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No restore operations found</p>
                  <p className="text-gray-500 text-sm mt-1">Restore operations will appear here</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3">Restore ID</th>
                        <th className="text-left py-3">Backup File</th>
                        <th className="text-left py-3">Type</th>
                        <th className="text-left py-3">Status</th>
                        <th className="text-left py-3">Started</th>
                        <th className="text-left py-3">Completed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {restoreJobs.map(job => (
                        <tr key={job.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 font-mono text-xs">restore-{job.id}</td>
                          <td className="py-3">{job.backup_file_name || 'N/A'}</td>
                          <td className="py-3 capitalize">{job.restore_type}</td>
                          <td className="py-3">
                            <StatusBadge status={job.status} />
                          </td>
                          <td className="py-3">
                            {job.started_at ? formatDate(job.started_at) : 'N/A'}
                          </td>
                          <td className="py-3">
                            {job.completed_at ? formatDate(job.completed_at) : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Backup Schedules</CardTitle>
              <CardDescription>Automated backup scheduling configuration</CardDescription>
            </CardHeader>
            <CardContent>
              {schedules.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No backup schedules found</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Create a schedule to automate backups
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {schedules.map(schedule => (
                    <Card key={schedule.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-3 h-3 rounded-full ${schedule.is_active ? 'bg-green-500' : 'bg-gray-400'}`}
                            ></div>
                            <div>
                              <h3 className="font-medium">{schedule.name}</h3>
                              <p className="text-sm text-gray-500">
                                {schedule.cron_expression} • {schedule.backup_type} backup •{' '}
                                {schedule.retention_days} days retention
                              </p>
                              {schedule.last_run_at && (
                                <p className="text-xs text-gray-400">
                                  Last run: {formatDate(schedule.last_run_at)}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={schedule.is_active ? 'default' : 'secondary'}>
                              {schedule.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Settings className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Restore Dialog */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore Database</DialogTitle>
            <DialogDescription>Restore your database from the selected backup</DialogDescription>
          </DialogHeader>
          {selectedBackupForRestore && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">Selected Backup</h4>
                <p className="text-sm text-gray-600">
                  {selectedBackupForRestore.fileName || selectedBackupForRestore.jobId}
                </p>
                <p className="text-xs text-gray-500">
                  Created: {formatDate(selectedBackupForRestore.startedAt)} • Size:{' '}
                  {selectedBackupForRestore.fileSize}
                </p>
              </div>

              <div>
                <Label htmlFor="restoreType">Restore Type</Label>
                <Select value={restoreType} onValueChange={setRestoreType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Restore</SelectItem>
                    <SelectItem value="schema_only">Schema Only</SelectItem>
                    <SelectItem value="data_only">Data Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Warning</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  This operation will overwrite your current database. This action cannot be undone.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRestoreDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={startRestore}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Starting Restore...' : 'Start Restore'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Backup</DialogTitle>
            <DialogDescription>Are you sure you want to delete this backup?</DialogDescription>
          </DialogHeader>
          {backupToDelete && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">Backup Details</h4>
                <p className="text-sm text-gray-600">
                  {backupToDelete.fileName || backupToDelete.jobId}
                </p>
                <p className="text-xs text-gray-500">
                  Created: {formatDate(backupToDelete.startedAt)} • Size:{' '}
                  {backupToDelete.fileSize || 'N/A'}
                </p>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-red-800">Warning</span>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  This action cannot be undone. The backup file will be permanently deleted.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button
              onClick={deleteBackup}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Deleting...' : 'Delete Backup'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service Information */}
      {serviceHealth && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Service Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Service:</span>
                <div className="font-medium">{serviceHealth.service}</div>
              </div>
              <div>
                <span className="text-gray-600">Port:</span>
                <div className="font-medium">{serviceHealth.port}</div>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <div className="font-medium">{serviceHealth.status}</div>
              </div>
              <div>
                <span className="text-gray-600">Last Check:</span>
                <div className="font-medium">{formatDate(serviceHealth.timestamp)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
