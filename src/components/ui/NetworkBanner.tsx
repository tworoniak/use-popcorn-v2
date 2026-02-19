type NetworkBannerProps = {
  isOnline: boolean;
};

export default function NetworkBanner({ isOnline }: NetworkBannerProps) {
  if (isOnline) return null;

  return (
    <div className='net-banner' role='status' aria-live='polite'>
      <span className='net-banner__dot' aria-hidden='true' />
      You’re offline — showing the last loaded results
    </div>
  );
}
