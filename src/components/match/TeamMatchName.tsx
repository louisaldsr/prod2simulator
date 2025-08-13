export interface TeamMatchNameProps {
  name: string;
}

export default function TeamMatchName(props: TeamMatchNameProps) {
  return (
    <span className="text-sm font-medium whitespace-nowrap">{props.name}</span>
  );
}
