import { sanitizeTeamName } from '@/lib/sanitizers';

export interface TeamProps {
  readonly id: string;
  readonly name: string;
}

export class Team {
  public readonly id: string;
  public readonly name: string;
  public readonly logoUrl: string;

  constructor(props: TeamProps) {
    this.id = props.id;
    this.name = props.name;
    this.logoUrl = `/team-logos/${sanitizeTeamName(props.name)}.svg`;
  }
}
