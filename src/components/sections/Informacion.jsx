import { Cell, Pie, PieChart } from 'recharts';

// Sample data
const data = [
    { name: 'Personas con peso normal', value: 37, color: '#0088FE' },
    { name: 'Personas con bajo peso', value: 3, color: '#00C49F' },
    { name: 'Personas con obesidad', value: 25, color: '#FFBB28' },
    { name: 'Personas con sobrepeso', value: 36, color: '#FF8042' },
];

const RADIAN = Math.PI / 180;
const COLORS = [, '#00C49F', '#FFBB28', '#FF8042'];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
        return null;
    }
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const ncx = Number(cx);
    const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const ncy = Number(cy);
    const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > ncx ? 'start' : 'end'} dominantBaseline="central">
            {`${((percent ?? 1) * 100).toFixed(0)}%`}
        </text>
    );
};

export default function Informacion({ isAnimationActive = true }) {
    return (
        <div id="informacion" className="w-full py-16 bg-white/50 border-t border-stone-100 flex flex-col justify-center mb-10">
            <div className="flex flex-col items-center justify-center">
                <h3 className="text-2xl font-bold text-stone-400 mb-2">Algunos datos interesantes</h3>
                <p className="text-stone-400 text-sm mb-6">Aca podes ver algunos datos generales sobre la nutrición en argentina</p>
            </div>
            <div className="">
                <PieChart style={{ width: '100%', maxWidth: '500px', maxHeight: '80vh', aspectRatio: 1 }} responsive>
                    <Pie
                        data={data}
                        labelLine={false}
                        label={renderCustomizedLabel}
                        fill="#8884d8"
                        dataKey="value"
                        isAnimationActive={isAnimationActive}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${entry.name}`} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 px-4 w-full max-w-2xl">
                {data.map((entry, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div
                            className="w-4 h-4 rounded-sm flex-shrink-0"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-stone-500 text-sm font-medium">{entry.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
