import { ClipLoader } from 'react-spinners';

type LoaderProps = { text?: string };

export default function Loader({ text = 'Loading...' }: LoaderProps) {
  return (
    <>
      <p className='loader'>{text}</p>
      <ClipLoader color='#FFF111' loading size={55} />;
    </>
  );
}

// export default function Loader() {
//   return <ClipLoader />;
// }
