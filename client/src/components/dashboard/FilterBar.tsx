import React, { useState } from 'react';
import { Calendar, ChevronDown, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const FilterBar: React.FC = () => {
  const [month, setMonth] = useState('november');
  const [quarter, setQuarter] = useState('q4');
  const [skill, setSkill] = useState('all');
  const [manager, setManager] = useState('all');

  return (
    <div className="h-14 px-6 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter size={16} />
          <span className="text-sm font-medium">Filters</span>
        </div>

        <div className="flex items-center gap-3">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-32 h-8 text-xs bg-secondary/50 border-border">
              <Calendar className="w-3 h-3 mr-1" />
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="january">January</SelectItem>
              <SelectItem value="february">February</SelectItem>
              <SelectItem value="march">March</SelectItem>
              <SelectItem value="april">April</SelectItem>
              <SelectItem value="may">May</SelectItem>
              <SelectItem value="june">June</SelectItem>
              <SelectItem value="july">July</SelectItem>
              <SelectItem value="august">August</SelectItem>
              <SelectItem value="september">September</SelectItem>
              <SelectItem value="october">October</SelectItem>
              <SelectItem value="november">November</SelectItem>
              <SelectItem value="december">December</SelectItem>
            </SelectContent>
          </Select>

          <Select value={quarter} onValueChange={setQuarter}>
            <SelectTrigger className="w-24 h-8 text-xs bg-secondary/50 border-border">
              <SelectValue placeholder="Quarter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="q1">Q1</SelectItem>
              <SelectItem value="q2">Q2</SelectItem>
              <SelectItem value="q3">Q3</SelectItem>
              <SelectItem value="q4">Q4</SelectItem>
            </SelectContent>
          </Select>

          <Select value={skill} onValueChange={setSkill}>
            <SelectTrigger className="w-28 h-8 text-xs bg-secondary/50 border-border">
              <SelectValue placeholder="Skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Skills</SelectItem>
              <SelectItem value="scala">Scala</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="aws">AWS</SelectItem>
              <SelectItem value="devops">DevOps</SelectItem>
              <SelectItem value="react">React</SelectItem>
              <SelectItem value="frontend">Frontend</SelectItem>
            </SelectContent>
          </Select>

          <Select value={manager} onValueChange={setManager}>
            <SelectTrigger className="w-36 h-8 text-xs bg-secondary/50 border-border">
              <SelectValue placeholder="Manager" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Managers</SelectItem>
              <SelectItem value="mohammed">Mohammed Lunat</SelectItem>
              <SelectItem value="stephanie">Stephanie Hilton</SelectItem>
              <SelectItem value="marcel">Marcel de Vries</SelectItem>
              <SelectItem value="martin">Martin Kohn</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="px-2 py-1 rounded bg-primary/10 text-primary font-medium">
          Nov 2025
        </span>
        <span>•</span>
        <span>€2.54M Revenue</span>
      </div>
    </div>
  );
};

export default FilterBar;
