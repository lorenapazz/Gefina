interface SummaryCardProps {
    label: string;
    value: string;
}

export default function SummaryCard(props: SummaryCardProps) {
    return <div className='flex-1 p-4 bg-surface border border-border rounded-surface'>
        <p className='mb-2 textsm text-text-muted'>{props.label}</p>
        <p className='numeric card-value'>{props.value}</p>
    </div>;
}