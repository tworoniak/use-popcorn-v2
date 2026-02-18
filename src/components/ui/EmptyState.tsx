type EmptyStateProps = {
  title: string;
  description?: string;
};

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className='empty'>
      <h3 className='empty__title'>{title}</h3>
      {description ? <p className='empty__desc'>{description}</p> : null}
    </div>
  );
}
