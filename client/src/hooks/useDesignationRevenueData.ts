import { useEffect, useMemo, useState } from 'react';
import { executeSQL } from '@/services/queryApi';

export function useDesignationRevenueData() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch once ---------------- */
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await executeSQL('select * from revenue');
        setRows(res.data);
      } catch (err) {
        console.error('Designation revenue fetch failed', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  /* ---------------- Aggregate by designation ---------------- */
  const designationRevenue = useMemo(() => {
    if (!rows.length) return [];

    const map = new Map<
      string,
      { revenue: number; count: number }
    >();

    rows.forEach((r) => {
      const designation = r.designation; // 🔁 change only if column differs
      const revenue = Number(r.actual_revenue) || 0;

      if (!designation) return;

      if (!map.has(designation)) {
        map.set(designation, { revenue: 0, count: 0 });
      }

      const entry = map.get(designation)!;
      entry.revenue += revenue;
      entry.count += 1;
    });

    const result = Array.from(map.entries()).map(
      ([designation, data]) => ({
        designation,
        revenue: data.revenue,
        count: data.count,
        avgRevenue: data.revenue / data.count,
      })
    );

    // 🔥 Sort by total revenue
    result.sort((a, b) => b.revenue - a.revenue);

    return result;
  }, [rows]);

  return {
    loading,
    designationRevenue,
  };
}
