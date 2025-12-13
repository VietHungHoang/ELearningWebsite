import React, { useState } from 'react';
import { HiCurrencyDollar, HiUserGroup, HiBookOpen, HiClock } from 'react-icons/hi';
import EnhancedStatCard from '../components/EnhancedStatCard';
import SessionCalendar from '../components/SessionCalendar';
import SessionCard from '../components/SessionCard';
import RevenueChart from '../components/RevenueChart';
import RecentActivity from '../components/RecentActivity';
import QuickStats from '../components/QuickStats';
import EmptySessionState from '../components/EmptySessionState';
import { addDays, startOfToday, setHours, setMinutes } from 'date-fns';
import type { Session, Activity } from '../types';

// Mock data for stats
const earningsData = [
    { value: 8000 }, { value: 9200 }, { value: 8500 }, { value: 10200 },
    { value: 11500 }, { value: 12345 }
];

const studentsData = [
    { value: 120 }, { value: 125 }, { value: 135 }, { value: 142 },
    { value: 148 }, { value: 150 }
];

const coursesData = [
    { value: 8 }, { value: 9 }, { value: 10 }, { value: 11 },
    { value: 11 }, { value: 12 }
];

const hoursData = [
    { value: 1800 }, { value: 2000 }, { value: 2100 }, { value: 2200 },
    { value: 2300 }, { value: 2400 }
];

// Mock data for revenue chart
const revenueData = [
    { month: 'Jul', revenue: 8000 },
    { month: 'Aug', revenue: 9200 },
    { month: 'Sep', revenue: 8500 },
    { month: 'Oct', revenue: 10200 },
    { month: 'Nov', revenue: 11500 },
    { month: 'Dec', revenue: 12345 },
    { month: 'Jan', revenue: 10800 },
    { month: 'Feb', revenue: 11200 },
    { month: 'Mar', revenue: 13500 },
    { month: 'Apr', revenue: 14200 },
    { month: 'May', revenue: 15100 },
    { month: 'Jun', revenue: 16800 }
];

// Mock data for sessions
const today = startOfToday();
const mockSessions: Session[] = [
    {
        id: '1',
        student: 'Sarah Chapman',
        studentAvatar: 'https://picsum.photos/seed/sarah/200/200',
        course: 'Time Management',
        topic: 'Prioritization Techniques',
        startTime: setMinutes(setHours(today, 10), 0),
        duration: 60,
        platform: 'Zoom',
        status: 'Confirmed',
        isOnline: true
    },
    {
        id: '2',
        student: 'Ann Coleman',
        studentAvatar: 'https://picsum.photos/seed/ann/200/200',
        course: 'Decision Making',
        topic: 'Critical Thinking Skills',
        startTime: setMinutes(setHours(today, 14), 0),
        duration: 45,
        platform: 'Meet',
        status: 'Confirmed',
        isOnline: false
    },
    {
        id: '3',
        student: 'Judy Dixon',
        studentAvatar: 'https://picsum.photos/seed/judy/200/200',
        course: 'Stress Management',
        topic: 'Mindfulness and Meditation',
        startTime: setMinutes(setHours(today, 16), 30),
        duration: 60,
        platform: 'Teams',
        status: 'Pending',
        isOnline: true
    },
    {
        id: '4',
        student: 'Michael Roberts',
        studentAvatar: 'https://picsum.photos/seed/michael/200/200',
        course: 'Public Speaking',
        topic: 'Overcoming Stage Fright',
        startTime: setMinutes(setHours(addDays(today, 1), 9), 0),
        duration: 90,
        platform: 'Zoom',
        status: 'Confirmed',
        isOnline: true
    },
    {
        id: '5',
        student: 'Emma Wilson',
        studentAvatar: 'https://picsum.photos/seed/emma/200/200',
        course: 'Leadership Skills',
        topic: 'Team Building Strategies',
        startTime: setMinutes(setHours(addDays(today, 1), 15), 0),
        duration: 60,
        platform: 'Meet',
        status: 'Rescheduled',
        isOnline: false
    }
];

// Mock data for recent activity
const recentActivities: Activity[] = [
    {
        id: '1',
        type: 'review',
        title: 'New 5-star review',
        description: 'Sarah Chapman left a review for "Time Management"',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        metadata: { rating: 5, studentName: 'Sarah Chapman' }
    },
    {
        id: '2',
        type: 'payment',
        title: 'Payment received',
        description: 'Monthly earnings from 3 courses',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        metadata: { amount: 850 }
    },
    {
        id: '3',
        type: 'enrollment',
        title: 'New student enrolled',
        description: 'Michael Roberts enrolled in "Public Speaking"',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        metadata: { studentName: 'Michael Roberts', courseName: 'Public Speaking' }
    },
    {
        id: '4',
        type: 'completion',
        title: 'Course completed',
        description: 'Ann Coleman completed "Decision Making" course',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        metadata: { studentName: 'Ann Coleman', courseName: 'Decision Making' }
    }
];

const TutorDashboardContent: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(today);
    const [filterMode, setFilterMode] = useState<'all' | 'today' | 'week'>('all');

    // Get session dates for calendar
    const sessionDates = mockSessions.map(session => session.startTime);

    // Filter sessions based on selected date and filter mode
    const filteredSessions = mockSessions.filter(session => {
        if (filterMode === 'today') {
            return session.startTime.toDateString() === today.toDateString();
        } else if (filterMode === 'week') {
            const weekFromNow = addDays(today, 7);
            return session.startTime >= today && session.startTime <= weekFromNow;
        } else if (selectedDate) {
            return session.startTime.toDateString() === selectedDate.toDateString();
        }
        return true;
    });

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setFilterMode('all');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-10">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Welcome back, Cynthia! 👋
                </h1>
                <p className="text-gray-600 mt-2">Here's an overview of your teaching activities</p>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <EnhancedStatCard
                    title="Total Earnings"
                    value="$12,345"
                    change="12.5%"
                    isPositive={true}
                    icon={<HiCurrencyDollar className="w-7 h-7" />}
                    gradient="bg-gradient-to-br from-green-500 to-emerald-600"
                    chartData={earningsData}
                />
                <EnhancedStatCard
                    title="Total Students"
                    value="150"
                    change="8.3%"
                    isPositive={true}
                    icon={<HiUserGroup className="w-7 h-7" />}
                    gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
                    chartData={studentsData}
                />
                <EnhancedStatCard
                    title="Active Courses"
                    value="12"
                    change="9.1%"
                    isPositive={true}
                    icon={<HiBookOpen className="w-7 h-7" />}
                    gradient="bg-gradient-to-br from-purple-500 to-pink-600"
                    chartData={coursesData}
                />
                <EnhancedStatCard
                    title="Teaching Hours"
                    value="2,400"
                    change="4.2%"
                    isPositive={true}
                    icon={<HiClock className="w-7 h-7" />}
                    gradient="bg-gradient-to-br from-amber-500 to-orange-600"
                    chartData={hoursData}
                />
            </div>

            {/* Revenue Chart */}
            <div className="mb-8">
                <RevenueChart data={revenueData} />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Upcoming Sessions - Takes 2 columns */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Upcoming Sessions</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''} scheduled
                                </p>
                            </div>

                            {/* Filter Buttons */}
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => setFilterMode('all')}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${filterMode === 'all'
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setFilterMode('today')}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${filterMode === 'today'
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Today
                                </button>
                                <button
                                    onClick={() => setFilterMode('week')}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${filterMode === 'week'
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    This Week
                                </button>
                            </div>
                        </div>

                        {/* Sessions Timeline */}
                        <div className="space-y-4">
                            {filteredSessions.length > 0 ? (
                                filteredSessions.map((session) => (
                                    <SessionCard key={session.id} session={session} />
                                ))
                            ) : (
                                <EmptySessionState />
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Calendar */}
                    <SessionCalendar
                        sessionDates={sessionDates}
                        onDateSelect={handleDateSelect}
                    />

                    {/* Quick Stats */}
                    <QuickStats
                        averageRating={4.8}
                        totalReviews={127}
                        completionRate={87}
                        responseTime="< 2h"
                    />
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <RecentActivity activities={recentActivities} />
            </div>
        </div>
    );
};

export default TutorDashboardContent;