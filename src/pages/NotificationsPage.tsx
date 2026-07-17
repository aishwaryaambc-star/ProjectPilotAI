import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, BellOff, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner, EmptyState } from '../components/ui/Loading';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import type { Notification } from '../types';
import { formatRelativeTime } from '../lib/utils';

export function NotificationsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (!user) return;
    loadNotifications();
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setNotifications((data as Notification[]) || []);
    } catch {
      toast('Failed to load notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id);
      if (error) throw error;
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch {
      toast('Failed to mark notification', 'error');
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      const { error } = await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false);
      if (error) throw error;
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      toast('All notifications marked as read', 'success');
    } catch {
      toast('Failed to mark all as read', 'error');
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase.from('notifications').delete().eq('id', id);
      if (error) throw error;
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {
      toast('Failed to delete notification', 'error');
    }
  };

  const filtered = filter === 'unread' ? notifications.filter((n) => !n.is_read) : notifications;
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const icons = { info: Info, success: CheckCircle2, warning: AlertCircle, error: AlertCircle };
  const colors = {
    info: 'text-primary-500 bg-primary-50 dark:bg-primary-900/20',
    success: 'text-success-500 bg-success-50 dark:bg-success-900/20',
    warning: 'text-warning-500 bg-warning-50 dark:bg-warning-900/20',
    error: 'text-error-500 bg-error-50 dark:bg-error-900/20',
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary-500" />
            Notifications
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{unreadCount} unread of {notifications.length} total</p>
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'unread'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                filter === f ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
          {unreadCount > 0 && (
            <Button size="sm" variant="ghost" icon={<Check className="w-4 h-4" />} onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<BellOff className="w-10 h-10" />}
          title="No notifications"
          description={filter === 'unread' ? 'You have no unread notifications' : 'You will see notifications here when you generate blueprints'}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((n) => {
            const Icon = icons[n.type] || Info;
            return (
              <Card key={n.id} hover={false} className={`p-4 ${!n.is_read ? 'border-primary-200 dark:border-primary-800 bg-primary-50/30 dark:bg-primary-900/10' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg shrink-0 ${colors[n.type] || colors.info}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{n.title}</h3>
                      {!n.is_read && <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(n.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!n.is_read && (
                      <button onClick={() => markAsRead(n.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-success-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all" aria-label="Mark as read">
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => deleteNotification(n.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-error-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all" aria-label="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
