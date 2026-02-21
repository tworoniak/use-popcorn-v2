import { BeatLoader } from 'react-spinners';

type LoaderProps = { text?: string };

export default function Loader({ text = 'Loading...' }: LoaderProps) {
  return (
    <div className='loader'>
      <p>{text}</p>

      <BeatLoader color='#FFF' loading size={24} />
    </div>
  );
}
