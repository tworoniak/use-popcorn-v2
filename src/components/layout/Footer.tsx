const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className='bg-gray-800 text-white py-4 text-center'>
      <p>&copy; {currentYear} usePopcorn. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
