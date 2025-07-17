import React, { useState, useEffect } from 'react';
import { 
  PrinterIcon, 
  DocumentIcon, 
  ClockIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  QueueListIcon,
  CogIcon
} from '@heroicons/react/24/outline';

interface PrintJob {
  id: string;
  templateName: string;
  productName: string;
  quantity: number;
  status: 'pending' | 'printing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  error?: string;
}

interface Printer {
  id: string;
  name: string;
  type: 'thermal' | 'inkjet' | 'laser';
  status: 'online' | 'offline' | 'busy';
  jobsInQueue: number;
}

export default function PrintManagement() {
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([
    {
      id: '1',
      templateName: 'Avery L7160',
      productName: 'Organic Bananas',
      quantity: 21,
      status: 'completed',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date(Date.now() - 3000000).toISOString(),
    },
    {
      id: '2',
      templateName: '58mm Thermal',
      productName: 'Basmati Rice',
      quantity: 50,
      status: 'printing',
      createdAt: new Date(Date.now() - 600000).toISOString(),
    },
    {
      id: '3',
      templateName: 'Avery L7163',
      productName: 'Turmeric Powder',
      quantity: 14,
      status: 'pending',
      createdAt: new Date(Date.now() - 300000).toISOString(),
    },
  ]);

  const [printers] = useState<Printer[]>([
    {
      id: '1',
      name: 'Zebra ZD420 - Branch 1',
      type: 'thermal',
      status: 'online',
      jobsInQueue: 2,
    },
    {
      id: '2',
      name: 'HP LaserJet Pro',
      type: 'laser',
      status: 'busy',
      jobsInQueue: 5,
    },
    {
      id: '3',
      name: 'Brother QL-820NWB',
      type: 'thermal',
      status: 'offline',
      jobsInQueue: 0,
    },
  ]);

  const [activeTab, setActiveTab] = useState<'jobs' | 'printers'>('jobs');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'printing':
        return <ArrowPathIcon className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPrinterStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const retryJob = (jobId: string) => {
    setPrintJobs(jobs => 
      jobs.map(job => 
        job.id === jobId ? { ...job, status: 'pending' } : job
      )
    );
  };

  const cancelJob = (jobId: string) => {
    setPrintJobs(jobs => jobs.filter(job => job.id !== jobId));
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <QueueListIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Jobs</p>
              <p className="text-2xl font-semibold">{printJobs.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-semibold">
                {printJobs.filter(j => j.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-semibold">
                {printJobs.filter(j => j.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <PrinterIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Active Printers</p>
              <p className="text-2xl font-semibold">
                {printers.filter(p => p.status === 'online').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`py-2 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'jobs'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Print Jobs
            </button>
            <button
              onClick={() => setActiveTab('printers')}
              className={`py-2 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'printers'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Printers
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'jobs' ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Recent Print Jobs</h3>
                <button className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                  <PrinterIcon className="w-4 h-4 mr-2" />
                  New Print Job
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Template
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {printJobs.map((job) => (
                      <tr key={job.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(job.status)}
                            <span className="ml-2 text-sm capitalize">{job.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {job.templateName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {job.productName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {job.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(job.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {job.status === 'failed' && (
                            <button
                              onClick={() => retryJob(job.id)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              Retry
                            </button>
                          )}
                          {(job.status === 'pending' || job.status === 'printing') && (
                            <button
                              onClick={() => cancelJob(job.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Configured Printers</h3>
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <CogIcon className="w-4 h-4 mr-2" />
                  Add Printer
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {printers.map((printer) => (
                  <div key={printer.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{printer.name}</h4>
                        <p className="text-sm text-gray-500 capitalize">{printer.type} Printer</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPrinterStatusColor(printer.status)}`}>
                        {printer.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Jobs in Queue:</span>
                        <span className="font-medium">{printer.jobsInQueue}</span>
                      </div>
                      
                      <div className="pt-3 border-t border-gray-100">
                        <button className="w-full text-center text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                          Configure Printer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}