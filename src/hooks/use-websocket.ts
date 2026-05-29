import { useEffect, useState, useRef } from "react";
import { getAccessToken } from "@/lib/auth-token";
import { useQueryClient } from "@tanstack/react-query";
import { todayKeys } from "@/routes/_auth/today/-queries/today.query";
import { reportKeys } from "@/routes/_auth/reports/-queries/report.query";

export function useWebSocket() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const queryClient = useQueryClient();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let isMounted = true;
    let reconnectAttempts = 0;

    const connect = () => {
      const token = getAccessToken();
      if (!token || !isMounted) return;

      const wsUrl = import.meta.env.VITE_WS_URL;
      if (!wsUrl) {
        console.warn("VITE_WS_URL is not defined in .env");
        return;
      }

      const websocket = new WebSocket(`${wsUrl}/ws?token=${token}`);
      wsRef.current = websocket;

      websocket.onopen = () => {
        console.log("WebSocket connected");
        reconnectAttempts = 0; // reset on successful connection
        if (isMounted) setWs(websocket);
      };

      websocket.onmessage = (event) => {
        console.log("WebSocket message:", event.data);
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.type === "meal_analysis" && parsed.status === "completed") {
            queryClient.invalidateQueries({ queryKey: todayKeys.all });
          } else if (parsed.type === "daily_report" && parsed.status === "completed") {
            queryClient.invalidateQueries({ queryKey: reportKeys.all });
          }
        } catch (err) {
          // Handle parsing error if needed
        }
      };

      websocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      websocket.onclose = (event) => {
        console.log("WebSocket disconnected", event.reason);
        if (isMounted) {
          setWs(null);
          // Auto-reconnect with exponential backoff (max 10s)
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000);
          reconnectAttempts++;
          console.log(`WebSocket reconnecting in ${delay}ms...`);
          reconnectTimeoutRef.current = setTimeout(connect, delay);
        }
      };
    };

    connect();

    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [queryClient]);

  return { ws };
}
