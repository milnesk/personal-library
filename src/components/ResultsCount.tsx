interface ResultsCountProps {
  count: number;
  total: number;
}

export function ResultsCount({ count, total }: ResultsCountProps) {
  const isFiltered = count !== total;

  return (
    <p 
      className="text-sm text-muted-foreground" 
      role="status" 
      aria-live="polite"
    >
      {isFiltered ? (
        <>
          Showing <span className="font-semibold text-foreground">{count}</span> of{' '}
          <span className="font-semibold text-foreground">{total}</span> books
        </>
      ) : (
        <>
          <span className="font-semibold text-foreground">{count}</span> books
        </>
      )}
    </p>
  );
}
