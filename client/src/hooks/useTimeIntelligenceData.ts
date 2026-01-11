import { useEffect, useMemo, useState } from 'react';
import { executeSQL } from '@/services/queryApi';

export function useTimeIntelligenceData() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await executeSQL(`
          SELECT 
            month,
            SUM(actual_revenue) AS revenue
          FROM revenue
          GROUP BY month
          ORDER BY month
        `);

        setRows(res.data ?? []);
      } catch (err) {
        console.error('Time intelligence fetch failed', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const monthlyRevenue = useMemo(() => {
    if (!rows.length) return [];

    return rows.map((r, index) => {
      const revenue = Number(r.revenue) || 0;
      const prevRevenue =
        index > 0 ? Number(rows[index - 1].revenue) : null;

      const growth =
        prevRevenue && prevRevenue !== 0
          ? ((revenue - prevRevenue) / prevRevenue) * 100
          : null;

      return {
        month: new Date(r.month).toLocaleString('en-US', { month: 'short' }),
        revenue,
        growth,
      };
    });
  }, [rows]);

  return {
    loading,
    monthlyRevenue,
  };
}
