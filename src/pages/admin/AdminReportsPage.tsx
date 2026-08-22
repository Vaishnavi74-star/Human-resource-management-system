import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Download, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MOCK_USERS_DB } from '../../data/mockUser';
import { leaveService } from '../../services/leaveService';
import { attendanceService } from '../../services/attendanceService';
import { payrollService } from '../../services/payrollService';
import { downloadCSV } from '../../utils/csvExport';

type ReportTab = 'attendance' | 'leave' | 'payroll';

export const AdminReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ReportTab>('attendance');
  
  // Data States
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [leaveData, setLeaveData] = useState<any[]>([]);
  const [payrollData, setPayrollData] = useState<any[]>([]);
  
  // Filter States
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [employeeFilter, setEmployeeFilter] = useState('');
  
  const departments = ['All', ...Array.from(new Set(MOCK_USERS_DB.map(u => u.department)))];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Load Leaves
    const leaves = await leaveService.getAllLeaveRequests();
    setLeaveData(leaves);

    // Mock Attendance for charting (In real app, fetch from attendanceService for a date range)
    const mockAtt = MOCK_USERS_DB.map(u => ({
      employeeName: u.name,
      department: u.department,
      presentDays: Math.floor(Math.random() * 5) + 18,
      absentDays: Math.floor(Math.random() * 3),
      lateDays: Math.floor(Math.random() * 2),
    }));
    setAttendanceData(mockAtt);

    // Load Payroll
    const payrolls = await payrollService.getAllEmployeePayrolls();
    setPayrollData(payrolls);
  };

  const handleExport = () => {
    if (activeTab === 'attendance') {
      downloadCSV(filteredAttendance, 'attendance_report');
    } else if (activeTab === 'leave') {
      downloadCSV(filteredLeave, 'leave_report');
    } else if (activeTab === 'payroll') {
      const exportData = filteredPayroll.map(p => ({
        Employee: p.employeeName,
        Role: p.role,
        BaseSalary: p.salaryStructure.baseSalary,
        Allowances: p.salaryStructure.allowances.reduce((acc: number, val: any) => acc + val.amount, 0),
        Deductions: p.salaryStructure.deductions.reduce((acc: number, val: any) => acc + val.amount, 0),
        NetSalary: p.netSalary,
        Status: p.status
      }));
      downloadCSV(exportData, 'payroll_report');
    }
  };

  // Filter Logic
  const filteredAttendance = attendanceData.filter(a => 
    (departmentFilter === 'All' || a.department === departmentFilter) &&
    a.employeeName.toLowerCase().includes(employeeFilter.toLowerCase())
  );

  const filteredLeave = leaveData.filter(l => 
    (departmentFilter === 'All' || l.department === departmentFilter) &&
    l.employeeName.toLowerCase().includes(employeeFilter.toLowerCase())
  );

  const filteredPayroll = payrollData.filter(p => 
    p.employeeName.toLowerCase().includes(employeeFilter.toLowerCase())
  );

  // Chart Colors
  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'];

  const renderAttendanceTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Attendance Overview</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredAttendance.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="employeeName" tick={{fontSize: 10}} tickMargin={10} />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="presentDays" name="Present" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absentDays" name="Absent" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-6 flex flex-col justify-center">
          <h3 className="text-sm font-bold text-slate-900 mb-2">Summary Statistics</h3>
          <div className="space-y-4 mt-4">
            <div>
              <p className="text-xs text-slate-500">Avg. Present Days</p>
              <p className="text-2xl font-bold text-indigo-600">
                {Math.round(filteredAttendance.reduce((a, b) => a + b.presentDays, 0) / (filteredAttendance.length || 1))}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Lates</p>
              <p className="text-2xl font-bold text-amber-500">
                {filteredAttendance.reduce((a, b) => a + b.lateDays, 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">Employee</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium text-right">Present</th>
                <th className="px-6 py-4 font-medium text-right">Absent</th>
                <th className="px-6 py-4 font-medium text-right">Late</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAttendance.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-900">{row.employeeName}</td>
                  <td className="px-6 py-4">{row.department}</td>
                  <td className="px-6 py-4 text-right text-emerald-600 font-medium">{row.presentDays}</td>
                  <td className="px-6 py-4 text-right text-rose-600 font-medium">{row.absentDays}</td>
                  <td className="px-6 py-4 text-right text-amber-600 font-medium">{row.lateDays}</td>
                </tr>
              ))}
              {filteredAttendance.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderLeaveTab = () => {
    const leaveStatusCounts = filteredLeave.reduce((acc, l) => {
      acc[l.status] = (acc[l.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const pieData = Object.keys(leaveStatusCounts).map(key => ({
      name: key,
      value: leaveStatusCounts[key]
    }));

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-1">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Leave Status Distribution</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="lg:col-span-2">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 font-medium">Employee</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium">Dates</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeave.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-medium text-slate-900">{row.employeeName}</td>
                      <td className="px-6 py-4">{row.leaveType}</td>
                      <td className="px-6 py-4 text-slate-500">{row.startDate} to {row.endDate}</td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant={row.status === 'Approved' ? 'success' : row.status === 'Pending' ? 'warning' : 'danger'}
                          size="sm"
                        >
                          {row.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {filteredLeave.length === 0 && (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No records found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const renderPayrollTab = () => {
    const chartData = filteredPayroll.slice(0, 10).map(p => ({
      name: p.employeeName,
      net: p.netSalary,
      deductions: p.salaryStructure.deductions.reduce((sum: number, d: any) => sum + d.amount, 0)
    }));

    return (
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Payroll Distribution (Top 10)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 10}} />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="net" name="Net Salary" fill="#4f46e5" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="deductions" name="Total Deductions" fill="#f43f5e" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-medium">Employee</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium text-right">Gross Salary</th>
                  <th className="px-6 py-4 font-medium text-right">Net Salary</th>
                  <th className="px-6 py-4 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayroll.map((row) => {
                  const gross = row.salaryStructure.baseSalary + row.salaryStructure.allowances.reduce((acc: number, val: any) => acc + val.amount, 0);
                  return (
                    <tr key={row.employeeId} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-medium text-slate-900">{row.employeeName}</td>
                      <td className="px-6 py-4 text-slate-500">{row.role}</td>
                      <td className="px-6 py-4 text-right">₹{gross.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900">₹{row.netSalary.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={row.status === 'Paid' ? 'success' : 'neutral'} size="sm">
                          {row.status}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
                {filteredPayroll.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Reports & Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Generate and export organizational insights.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <Card className="p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-700">Filters:</span>
        </div>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        >
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <input
          type="text"
          placeholder="Employee Name..."
          value={employeeFilter}
          onChange={(e) => setEmployeeFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 max-w-[200px]"
        />
      </Card>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-200 pb-1">
        {(['attendance', 'leave', 'payroll'] as ReportTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-bold uppercase tracking-wider capitalize transition-all border-b-2 ${
              activeTab === tab 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-300">
        {activeTab === 'attendance' && renderAttendanceTab()}
        {activeTab === 'leave' && renderLeaveTab()}
        {activeTab === 'payroll' && renderPayrollTab()}
      </div>
    </div>
  );
};
