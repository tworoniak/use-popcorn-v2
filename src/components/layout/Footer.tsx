const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className='footer'>
      <p>&copy; {currentYear} usePopcorn. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
