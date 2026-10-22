interface SummaryCardProps {
    label: string;
    value: string;
}

export default function SummaryCard(props: SummaryCardProps) {
    return <div className="card">
        <p>{props.label}</p>
        <p className="numeric">{props.value}</p>
    </div>;
}