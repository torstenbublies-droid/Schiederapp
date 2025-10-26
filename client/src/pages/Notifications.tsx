import { useState } from "react";
import { Bell, Trash2, CheckCheck, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

export default function Notifications() {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: notifications, isLoading, refetch } = trpc.userNotifications.list.useQuery({ limit: 50 });
  const { data: unreadCount } = trpc.userNotifications.unreadCount.useQuery();
  
  const markAsReadMutation = trpc.userNotifications.markAsRead.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const markAllAsReadMutation = trpc.userNotifications.markAllAsRead.useMutation({
    onSuccess: () => {
      refetch();
      toast({
        title: "Alle als gelesen markiert",
        description: "Alle Benachrichtigungen wurden als gelesen markiert.",
      });
    },
  });

  const deleteMutation = trpc.userNotifications.delete.useMutation({
    onSuccess: () => {
      refetch();
      setDeletingId(null);
      toast({
        title: "Benachrichtigung gelöscht",
        description: "Die Benachrichtigung wurde erfolgreich gelöscht.",
      });
    },
    onError: () => {
      setDeletingId(null);
      toast({
        title: "Fehler",
        description: "Die Benachrichtigung konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    },
  });

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate({ id });
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteMutation.mutate({ id });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return "⚠️";
      case "danger":
        return "🚨";
      case "event":
        return "📅";
      default:
        return "ℹ️";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Benachrichtigungen</h1>
                <p className="text-blue-100 text-sm">
                  {unreadCount ? `${unreadCount} ungelesen` : "Keine ungelesenen Benachrichtigungen"}
                </p>
              </div>
            </div>
            {unreadCount && unreadCount > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending}
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Alle als gelesen
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-4xl mx-auto p-4 space-y-3">
        {!notifications || notifications.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Keine Benachrichtigungen vorhanden</p>
              <p className="text-sm text-gray-500 mt-2">
                Hier werden alle empfangenen Push-Benachrichtigungen angezeigt
              </p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all ${
                !notification.isRead ? "bg-blue-50 border-blue-200" : "bg-white"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl mt-1">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg leading-tight">
                        {notification.title}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {formatDistanceToNow(new Date(notification.receivedAt), {
                          addSuffix: true,
                          locale: de,
                        })}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={markAsReadMutation.isPending}
                      >
                        <CheckCheck className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(notification.id)}
                      disabled={deletingId === notification.id}
                    >
                      {deletingId === notification.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-red-600" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-700 whitespace-pre-wrap">{notification.message}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

