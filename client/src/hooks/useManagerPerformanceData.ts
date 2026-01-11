import { useEffect, useMemo, useState } from 'react';
import { executeSQL } from '@/services/queryApi';

export function useManagerPerformanceData() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch ONCE ---------------- */
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await executeSQL('select * from revenue');
        setRows(res.data ?? []);
      } catch (err) {
        console.error('Manager performance fetch failed', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  /* ---------------- Aggregate OVERALL revenue per manager ---------------- */
  const managerQuarterlyData = useMemo(() => {
    if (!rows.length) return [];

    const map = new Map<
      string,
      { Q1: number; Q2: number; Q3: number; Q4: number }
    >();

    rows.forEach((r) => {
      const manager = r.manager; // 🔁 change ONLY if column differs
      const revenue = Number(r.actual_revenue) || 0;

      if (!manager || revenue <= 0) return;

      if (!map.has(manager)) {
        map.set(manager, { Q1: 0, Q2: 0, Q3: 0, Q4: 0 });
      }

      // ✅ TEMP: treat ALL revenue as Q4 (overall)
      map.get(manager)!.Q4 += revenue;
    });

    return Array.from(map.entries()).map(([manager, q]) => ({
      manager,
      ...q,
    }));
  }, [rows]);

  /* ---------------- Total Revenue by Manager ---------------- */
  const managerRevenue = useMemo(() => {
    return managerQuarterlyData
      .map((m) => ({
        manager: m.manager,
        revenue: m.Q1 + m.Q2 + m.Q3 + m.Q4,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [managerQuarterlyData]);

  return {
    loading,
    managerQuarterlyData,
    managerRevenue,
  };
}
