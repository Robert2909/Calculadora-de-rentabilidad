// Función principal de cálculo
function calcularGanancia() {
  try {
    const nombre = document.getElementById("nombre").value;
    const precio = parseFloat(document.getElementById("precio").value) || 0;
    const proveedor = parseFloat(document.getElementById("proveedor").value) || 0;
    const tiktok_pct = parseFloat(document.getElementById("tiktok").value) || 0;
    const afiliado_pct = parseFloat(document.getElementById("afiliado").value) || 0;
    const envio = parseFloat(document.getElementById("envio").value) || 0;
    const embalaje = parseFloat(document.getElementById("embalaje").value) || 0;
    const incluirAlm = document.getElementById("incluirAlmacenaje").checked;

    const almacenajeInput = document.getElementById("almacenaje");
    almacenajeInput.disabled = !incluirAlm;
    almacenajeInput.classList.toggle("deshabilitado", !incluirAlm);

    const almacenaje = incluirAlm ? parseFloat(almacenajeInput.value || 0) : 0;

    const com_tiktok = precio * (tiktok_pct / 100);
    const com_afiliado = precio * (afiliado_pct / 100);
    const total_gastos = proveedor + com_tiktok + com_afiliado + envio + embalaje + almacenaje;
    const ganancia = precio - total_gastos;
    const margen = (ganancia / precio) * 100;
    const costo_inversion = proveedor + envio + embalaje + almacenaje;
    const roi = costo_inversion ? (ganancia / costo_inversion) * 100 : 0;
    const equilibrio = precio ? total_gastos / precio : 0;

    const resultadoHTML = document.getElementById("resultado");
    resultadoHTML.innerHTML = "";
    resultadoHTML.style.display = "block";

    const linea = (etiqueta, valor) => `
      <div class="resultado-linea">
        <span>${etiqueta}</span>
        <span>${valor}</span>
      </div>`;

    resultadoHTML.innerHTML += `
      <div class="resultado-seccion">
        <h3>Resumen de Producto: ${nombre}</h3>
        ${linea("Precio de venta:", `+$${precio.toFixed(2)}`)}
      </div>`;

    let bloqueCostos = `
      ${linea("Costo proveedor:", `-$${proveedor.toFixed(2)}`)}
      ${linea(`Comisión TikTok (${tiktok_pct}%):`, `-$${com_tiktok.toFixed(2)}`)}
      ${linea(`Comisión afiliado (${afiliado_pct}%):`, `-$${com_afiliado.toFixed(2)}`)}
      ${linea("Envío:", `-$${envio.toFixed(2)}`)}
      ${linea("Embalaje:", `-$${embalaje.toFixed(2)}`)}
      ${linea("Almacenaje Shipster:", `-$${almacenaje.toFixed(2)}`)}
      ${linea("Total gastos:", `-$${total_gastos.toFixed(2)}`)}
    `;

    resultadoHTML.innerHTML += `
      <div class="resultado-seccion">
        <h3>Costos Totales</h3>
        ${bloqueCostos}
      </div>`;

    resultadoHTML.innerHTML += `
      <div class="resultado-seccion">
        <h3>Ganancias</h3>
        ${linea("Ganancia neta:", `$${ganancia.toFixed(2)}`)}
        ${linea("Margen de ganancia:", `${margen.toFixed(2)}%`)}
      </div>`;

    resultadoHTML.innerHTML += `
      <div class="resultado-seccion">
        <h3>Métricas adicionales</h3>
        ${linea("ROI:", `${roi.toFixed(2)}%`)}
        ${linea("Unidades para cubrir costos:", `${equilibrio.toFixed(2)}`)}
        ${linea("Ganancia por unidad:", `$${ganancia.toFixed(2)}`)}
      </div>`;

    let conclusionTexto = "";
    if (margen > 20) {
      conclusionTexto = "✅ Buen margen.";
    } else if (margen >= 10) {
      conclusionTexto = "⚠️ Margen aceptable.";
    } else {
      conclusionTexto = "❌ Margen bajo.";
    }

    resultadoHTML.innerHTML += `
      <div class="resultado-seccion">
        <h3>Conclusión</h3>
        <div class="conclusion">${conclusionTexto}</div>
      </div>`;

  } catch (err) {
    alert("Error en los datos ingresados. Verifica los campos numéricos.\n" + err.message);
  }
}

// Escuchar cualquier cambio en inputs o checkbox
document.querySelectorAll("input").forEach(input => {
  input.addEventListener("input", calcularGanancia);
  input.addEventListener("change", calcularGanancia);
});

// Ejecutar una vez al cargar
calcularGanancia();
