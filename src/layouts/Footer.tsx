function Footer() {
  return (
    <footer className="scanlines">
      <div className="container-xl" style={{padding: '24px 0'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <span style={{opacity:.7}}>© Potato PC {new Date().getFullYear()}</span>
          <span style={{opacity:.65}}>Сделано с ❤️ в чёрно-красном</span>
        </div>
      </div>
    </footer>
  );
}
export default Footer;