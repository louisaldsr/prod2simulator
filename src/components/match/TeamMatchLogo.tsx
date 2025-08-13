import Image from 'next/image';

interface TeamMatchLogoProps {
  name: string;
  logoUrl: string;
}

export default function TeamMatchLogo(props: TeamMatchLogoProps) {
  return (
    <div className="w-8 h-8 sm:w-10 sm:h-8 overflow-hidden shrink-0">
      <Image
        src={props.logoUrl}
        alt={`${props.name} logo`}
        width={500}
        height={500}
        className="w-full h-full object-contain"
      />
    </div>
  );
}
