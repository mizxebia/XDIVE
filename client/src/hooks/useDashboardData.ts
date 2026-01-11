import { useEffect, useMemo, useState } from 'react';
import { executeSQL } from '@/services/queryApi';
 
export function useDashboardData() {
  const [rawRows, setRawRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
 
  /* ---------------- Fetch ONCE (ALL DATA) ---------------- */
  useEffect(() => {
    async function fetchData() {
      try {
        // IMPORTANT: no month filter → all months aggregated
        const res = await executeSQL('select * from revenue');
        setRawRows(res.data);
      } catch (err) {
        console.error('Dashboard fetch failed', err);
      } finally {
        setLoading(false);
      }
    }
 
    fetchData();
  }, []);
 
  /* ---------------- CLIENT-LEVEL AGGREGATION ---------------- */
  const clientData = useMemo(() => {
    if (!rawRows.length) return [];
 
    const clientMap = new Map<string, number>();
 
    rawRows.forEach((row) => {
      const revenue = Number(row.actual_revenue) || 0;
      const client = row.customer;
 
      clientMap.set(client, (clientMap.get(client) || 0) + revenue);
    });
 
    const clients = Array.from(clientMap.entries()).map(
      ([client, revenue]) => ({
        name: client.replace(/^47D_/, '').split('-')[0].trim(),
        fullName: client,
        value: revenue, // USD
      })
    );
 
    // Sort descending (Pareto requirement)
    clients.sort((a, b) => b.value - a.value);
 
    // Top N + Others (matches reference UI density)
    const TOP_N = 10;
    const top = clients.slice(0, TOP_N);
    const othersValue = clients
      .slice(TOP_N)
      .reduce((sum, c) => sum + c.value, 0);
 
    if (othersValue > 0) {
      top.push({
        name: 'Others',
        fullName: 'Others',
        value: othersValue,
      });
    }
 
    return top;
  }, [rawRows]);
 
  /* ---------------- TOTAL REVENUE ---------------- */
  const totalValue = useMemo(
    () => clientData.reduce((sum, c) => sum + c.value, 0),
    [clientData]
  );
 
  /* ---------------- PARETO DATA ---------------- */
  const paretoData = useMemo(() => {
    let cumulative = 0;
 
    return clientData.map((c) => {
      cumulative += c.value;
      return {
        ...c,
        cumulative: totalValue
          ? (cumulative / totalValue) * 100
          : 0,
      };
    });
  }, [clientData, totalValue]);
 
  return {
    loading,
    data: clientData,
    paretoData,
    totalValue,
  };
}