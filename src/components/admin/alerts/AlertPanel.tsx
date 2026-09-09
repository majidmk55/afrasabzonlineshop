import { useState, useEffect } from 'react';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { mockAlerts, type Alert } from '../../../lib/analytics/mockData';

export default function AlertPanel() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  // Auto-refresh هر 30 ثانیه
  useEffect(() => {
    const interval = setInterval(() => {
      // شبیه‌سازی دریافت هشدار جدید
      console.log('Refreshing alerts...');
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(a => a.type === filter);

  const markAsRead = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const getIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return <AlertCircle size={20} className="text-coral" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-amber-500" />;
      case 'info':
        return <Info size={20} className="text-sea" />;
    }
  };

  const getBgColor = (type: Alert['type'], read: boolean) => {
    if (read) return 'bg-white';
    switch (type) {
      case 'critical':
        return 'bg-coral/5';
      case 'warning':
        return 'bg-amber-50';
      case 'info':
        return 'bg-sea/5';
    }
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-lg font-bold">هشدارها</h3>
          {unreadCount > 0 && (
            <span className="rounded-full bg-coral px-2 py-0.5 text-xs font-bold text-white">
              {unreadCount.toLocaleString('fa-IR')}
            </span>
          )}
        </div>
        <div className="flex gap-1">
          {(['all', 'critical', 'warning', 'info'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
                filter === f ? 'bg-sea text-white' : 'bg-foam text-mist hover:bg-line'
              }`}
            >
              {f === 'all' ? 'همه' : f === 'critical' ? 'بحرانی' : f === 'warning' ? 'هشدار' : 'اطلاع'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <p className="py-8 text-center text-sm text-mist">هشداری وجود ندارد</p>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-xl border border-line p-4 transition-all hover:shadow-md ${getBgColor(alert.type, alert.read)}`}
              onClick={() => markAsRead(alert.id)}
            >
              <div className="flex items-start gap-3">
                {getIcon(alert.type)}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-bold text-ink">{alert.title}</h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeAlert(alert.id);
                      }}
                      className="text-mist hover:text-coral"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-mist">{alert.message}</p>
                  <p className="mt-2 text-xs text-mist">
                    {alert.timestamp.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
