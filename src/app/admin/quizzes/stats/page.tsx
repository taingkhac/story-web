'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Trophy, TrendingUp, Users, Target } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function QuizStatsPage() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
    const [totalAttempts, setTotalAttempts] = useState(0)
    const [totalViews, setTotalViews] = useState(0)
    const [avgScorePercentage, setAvgScorePercentage] = useState(0)
    const [topQuiz, setTopQuiz] = useState<{ title: string, attempts: number } | null>(null)
    const [dailyData, setDailyData] = useState<{ date: string, attempts: number }[]>([])

    const supabase = createClient()

    useEffect(() => {
        async function fetchStats() {
            try {
                setLoading(true)

                // 1. Fetch total quiz views
                const { data: quizzes, error: qErr } = await supabase.from('quizzes').select('title, view_count, id')
                if (qErr) throw qErr
                
                const views = quizzes.reduce((sum, q) => sum + (q.view_count || 0), 0)
                setTotalViews(views)

                // 2. Fetch all attempts (In real life, chunk this or use RPC aggregation)
                const { data: attempts, error: aErr } = await supabase.from('quiz_attempts').select('quiz_id, score, total_questions, completed_at')
                if (aErr) throw aErr

                setTotalAttempts(attempts.length)

                if (attempts.length > 0) {
                    const totalPercentage = attempts.reduce((acc, a) => {
                        return acc + (a.total_questions > 0 ? (a.score / a.total_questions) * 100 : 0)
                    }, 0)
                    setAvgScorePercentage(totalPercentage / attempts.length)
                }

                // Top Quiz by attempts
                if (attempts.length > 0) {
                    const quizAttemptCounts = attempts.reduce((acc, a) => {
                        acc[a.quiz_id] = (acc[a.quiz_id] || 0) + 1
                        return acc
                    }, {} as Record<string, number>)

                    let maxId = ''
                    let maxCount = 0
                    for (const [id, count] of Object.entries(quizAttemptCounts)) {
                        if (count > maxCount) {
                            maxCount = count
                            maxId = id
                        }
                    }

                    const topQ = quizzes.find(q => q.id === maxId)
                    if (topQ) {
                        setTopQuiz({ title: topQ.title, attempts: maxCount })
                    }
                }

                // Daily data for the last 30 days
                // Group attempts by date
                const last30Days = [...Array(30)].map((_, i) => {
                    const d = new Date()
                    d.setDate(d.getDate() - i)
                    return d.toISOString().split('T')[0]
                }).reverse()

                const groupedDaily: Record<string, number> = {}
                last30Days.forEach(d => groupedDaily[d] = 0)

                attempts.forEach(a => {
                    const date = a.completed_at.split('T')[0]
                    if (groupedDaily[date] !== undefined) {
                        groupedDaily[date] += 1
                    }
                })

                setDailyData(Object.entries(groupedDaily).map(([date, count]) => ({
                    date: date.substring(5).replace('-', '/'), // format MM/DD
                    attempts: count
                })))

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error loading stats')
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [supabase])

    if (loading) return <LoadingSpinner text="Crunching numbers..." />

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Quiz Statistics</h1>

            {error && (
                <div className="mb-8 rounded-xl bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20 font-bold">
                    {error}
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 flex items-center justify-between shadow-lg">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Total Attempts</p>
                        <h2 className="text-3xl font-bold text-white">{totalAttempts.toLocaleString()}</h2>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400">
                        <Users size={24} />
                    </div>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 flex items-center justify-between shadow-lg">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Total Page Views</p>
                        <h2 className="text-3xl font-bold text-white">{totalViews.toLocaleString()}</h2>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <Trophy size={24} />
                    </div>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 flex items-center justify-between shadow-lg">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Avg Score</p>
                        <h2 className="text-3xl font-bold text-white">{avgScorePercentage.toFixed(1)}%</h2>
                        <p className="text-xs text-zinc-500 mt-1">Across all quizzes</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                        <Target size={24} />
                    </div>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 flex items-center justify-between shadow-lg">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Most Popular</p>
                        <h2 className="text-lg font-bold text-white truncate max-w-[120px]" title={topQuiz?.title}>{topQuiz ? topQuiz.title : 'N/A'}</h2>
                        <p className="text-xs text-zinc-500 mt-1">{topQuiz?.attempts || 0} attempts</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                        <TrendingUp size={24} />
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <TrendingUp size={20} className="text-teal-400" />
                    Quiz Completion Activity (Last 30 Days)
                </h3>
                
                <div className="h-[400px] w-full">
                    {dailyData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorAttempts" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickMargin={10} axisLine={false} />
                                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }}
                                    itemStyle={{ color: '#0d9488', fontWeight: 'bold' }}
                                    cursor={{ stroke: '#27272a', strokeWidth: 2 }}
                                />
                                <Area type="monotone" dataKey="attempts" name="Completions" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorAttempts)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-zinc-500">
                            No data available for the last 30 days
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
