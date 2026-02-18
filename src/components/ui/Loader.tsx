type LoaderProps = { text?: string };

export default function Loader({ text = 'Loading...' }: LoaderProps) {
  return <p className='loader'>{text}</p>;
}
