import React, { useMemo, useState } from 'react'
import { useAppSelector } from '../../store/hooks'
import { AdminStatCard, AdminTimeRangeFilter, AdminMetricGroup } from '../../components/admin'
import { AreaChart, BarChart, DonutChart } from '../../components/charts'

const AdminDashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)

  const [range, setRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  const weekly = [
    { label: 'Mon', value: 120 },
    { label: 'Tue', value: 180 },
    { label: 'Wed', value: 260 },
    { label: 'Thu', value: 220 },
    { label: 'Fri', value: 340 },
    { label: 'Sat', value: 280 },
    { label: 'Sun', value: 190 }
  ]

  const monthly = [
    { label: 'Jan', value: 320 },
    { label: 'Feb', value: 410 },
    { label: 'Mar', value: 380 },
    { label: 'Apr', value: 520 },
    { label: 'May', value: 610 },
    { label: 'Jun', value: 740 }
  ]

  const userRoleSplit = [
    { label: 'Students', value: 78, color: '#3b82f6' },
    { label: 'Tutors', value: 20, color: '#10b981' },
    { label: 'Admins', value: 2, color: '#f59e0b' }
  ]

  const topTutors = [
    { label: 'S. Ford', value: 740 },
    { label: 'A. Shao', value: 680 },
    { label: 'J. Smith', value: 620 },
    { label: 'L. Nguyen', value: 540 },
    { label: 'M. Chen', value: 490 }
  ]

  const topCourses = [
    { label: 'React 101', value: 820 },
    { label: 'TS Advanced', value: 690 },
    { label: 'UI Design', value: 610 },
    { label: 'Node APIs', value: 530 },
    { label: 'SQL Mastery', value: 460 }
  ]

  const rangeLabel = useMemo(() => {
    switch (range) {
      case '7d': return 'Last 7 Days'
      case '30d': return 'Last 30 Days'
      case '90d': return 'Last 90 Days'
      case '1y': return 'Last 12 Months'
    }
  }, [range])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              📊 Analytics Hub
            </h1>
            <p className="text-slate-600 mt-1 text-base">
              Welcome back, {user?.name}! <span className="font-semibold text-blue-600">{rangeLabel}</span>
            </p>
          </div>
          <AdminTimeRangeFilter value={range} onChange={setRange} />
        </div>

        {/* 1. System Overview */}
        <AdminMetricGroup title="System Overview" action={<span className="text-sm text-gray-500">Updated just now</span>}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AdminStatCard label="Total Users" value="12,483" trend="▲ 4.3%" />
            <AdminStatCard label="Total Courses" value="1,024" trend="▲ 2.6%" />
            <AdminStatCard label="Active Courses" value="284" trend="▲ 1.1%" />
            <AdminStatCard label="Total Revenue" value="$1,245,930" trend="▲ 9.2%" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AreaChart title="Monthly Growth (Users/Revenue)" data={monthly} />
            </div>
            <div>
              <DonutChart title="User Distribution" data={userRoleSplit} />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <AdminStatCard label="Active Users Today" value="1,284" trend="▲ 3.1%" />
            <AdminStatCard label="Active Users This Week" value="6,512" trend="▲ 5.4%" />
            <AdminStatCard label="Monthly Growth (Users)" value="+7.8%" />
            <AdminStatCard label="Monthly Growth (Revenue)" value="+12.4%" />
          </div>
        </AdminMetricGroup>

        {/* 2. Tutor Metrics */}
        <AdminMetricGroup title="Tutor Metrics">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <AdminStatCard label="Total Tutors" value="1,142" trend="▲ 1.9%" />
            <AdminStatCard label="Average Rating" value="4.6 / 5" />
            <AdminStatCard label="Avg Courses/Tutor" value="3.4" />
            <AdminStatCard label="New Tutors (30d)" value="42" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart title="Top 5 Tutors by Enrollments" data={topTutors} />
            <AreaChart title="Tutor Engagement" data={weekly} />
          </div>
        </AdminMetricGroup>

        {/* 3. Student Metrics */}
        <AdminMetricGroup title="Student Metrics">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <AdminStatCard label="Total Enrollments" value="38,920" trend="▲ 6.4%" />
            <AdminStatCard label="Completion Rate" value="62%" trend="▲ 1.2%" />
            <AdminStatCard label="Avg Learning Time" value="5.3 h / student" />
            <AdminStatCard label="Active Students (30d)" value="12,104" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AreaChart title="Student Activity" data={weekly} />
            <BarChart title="Top Performing Students (completions)" data={topTutors} />
          </div>
        </AdminMetricGroup>

        {/* 4. Financial Metrics */}
        <AdminMetricGroup title="Financial Metrics">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <AdminStatCard label="Total Revenue" value="$1,245,930" trend="▲ 12.4%" />
            <AdminStatCard label="Refund Rate" value="1.8%" trend="▼ 0.2%" />
            <AdminStatCard label="ARPU" value="$34.20" />
            <AdminStatCard label="MRR" value="$82,450" trend="▲ 5.1%" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AreaChart title="Revenue by Month" data={monthly} />
            <BarChart title="Top Selling Courses" data={topCourses} />
          </div>
        </AdminMetricGroup>

        {/* 5. Engagement Metrics */}
        <AdminMetricGroup title="Engagement Metrics">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <AdminStatCard label="Total Reviews" value="8,210" trend="▲ 3.7%" />
            <AdminStatCard label="Avg Rating / Course" value="4.5 / 5" />
            <AdminStatCard label="Total Views (30d)" value="182k" />
            <AdminStatCard label="Top Category: Web Dev" value="24% traffic" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2"><AreaChart title="Views over Time" data={weekly} /></div>
            <DonutChart title="Popular Categories" data={[
              { label: 'Web Dev', value: 24, color: '#3b82f6' },
              { label: 'Data Sci', value: 18, color: '#10b981' },
              { label: 'Design', value: 14, color: '#f59e0b' },
              { label: 'Business', value: 12, color: '#ef4444' },
              { label: 'Others', value: 32, color: '#6366f1' },
            ]} />
          </div>
        </AdminMetricGroup>

        {/* 6. Certificate Metrics */}
        <AdminMetricGroup title="Certificate Metrics">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <AdminStatCard label="Certificates Issued" value="6,420" trend="▲ 2.8%" />
            <AdminStatCard label="Certificates This Month" value="740" trend="▲ 1.9%" />
            <AdminStatCard label="Top Certified Students" value="S. Nguyen, T. Tran" />
            <AdminStatCard label="Top Certified Course" value="React 101" />
          </div>
        </AdminMetricGroup>

        {/* 7. System Health */}
        <AdminMetricGroup title="System Health">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <AdminStatCard label="Login Success Rate" value="98.2%" trend="▲ 0.3%" />
            <AdminStatCard label="API Uptime" value="99.95%" />
            <AdminStatCard label="Errors (24h)" value="12" trend="▼ 8%" />
            <AdminStatCard label="P95 Latency" value="220 ms" />
          </div>
        </AdminMetricGroup>
      </div>
    </div>
  )
}

export default AdminDashboardPage
