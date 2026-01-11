import { useEffect, useMemo, useState } from 'react';
import { executeSQL } from '@/services/queryApi';

export function useSkillRevenueData() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch once ---------------- */
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await executeSQL('select * from revenue');
        setRows(res.data);
      } catch (err) {
        console.error('Skill revenue fetch failed', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  /* ---------------- Aggregate revenue by UNIQUE skill ---------------- */
  const skillRevenue = useMemo(() => {
    if (!rows.length) return [];

    const map = new Map<string, number>();

    rows.forEach((r) => {
      const rawSkills = r.skill; // e.g. "Scala, Kotlin, DevOps"
      const revenue = Number(r.actual_revenue) || 0;

      if (!rawSkills || revenue <= 0) return;

      // ✅ Split + normalize skills
      const skills = rawSkills
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);

      skills.forEach((skill: string) => {
        map.set(skill, (map.get(skill) || 0) + revenue);
      });
    });

    const result = Array.from(map.entries()).map(
      ([skill, revenue]) => ({
        skill,
        revenue,
      })
    );

    // ✅ Sort descending
    result.sort((a, b) => b.revenue - a.revenue);

    return result;
  }, [rows]);

  return {
    loading,
    skillRevenue,
  };
}
