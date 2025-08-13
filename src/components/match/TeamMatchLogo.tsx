interface TeamMatchLogoProps {
  name: string;
  logoUrl: string;
}

export default function TeamMatchLogo(props: TeamMatchLogoProps) {
  return (
    <div className="w-8 h-8 sm:w-10 sm:h-8 overflow-hidden shrink-0">
      <img
        src={props.logoUrl}
        alt={`${props.name} logo`}
        className="w-full h-full object-contain"
      />
    </div>
  );
}
