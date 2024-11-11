import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from './Cart/page';

import Home from './Home/page'; 
import Detalle from './Detalle/page'; 
import Contacto from './Contacto/page';
import Producto from './Productos/page';
import DetalleCart from './DetalleCart/page';

/*npm install react-router-dom */

function App() {

  return (
    <CartProvider>
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/detalle" element={<Detalle />} />
        <Route path="/contacto" element={<Contacto/>}/>
        <Route path="/productos" element={<Producto/>}/>
        <Route path="/detallecarrito" element={<DetalleCart/>}/>
      </Routes>
    </Router>
    </CartProvider>
  );
}

export default App;